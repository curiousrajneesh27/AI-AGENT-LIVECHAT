import OpenAI from 'openai';
import { Message } from '../database/services';
import { SYSTEM_PROMPT } from './knowledge';

/**
 * LLM Service Configuration
 * Encapsulated for easy modification and testing
 */
class LLMConfig {
  private static instance: LLMConfig;
  
  readonly maxTokens: number;
  readonly temperature: number;
  readonly model: string;
  readonly maxRetries: number;
  readonly timeout: number;
  readonly maxHistoryMessages: number;
  
  private constructor() {
    this.maxTokens = parseInt(process.env.MAX_TOKENS || '500', 10);
    this.temperature = parseFloat(process.env.TEMPERATURE || '0.7');
    this.model = process.env.MODEL || 'openai/gpt-3.5-turbo';
    this.maxRetries = 3;
    this.timeout = 30000; // 30 seconds
    this.maxHistoryMessages = 10;
  }
  
  static getInstance(): LLMConfig {
    if (!LLMConfig.instance) {
      LLMConfig.instance = new LLMConfig();
    }
    return LLMConfig.instance;
  }
}

// Initialize OpenRouter client lazily to ensure env vars are loaded
let openaiClient: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }
    
    openaiClient = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:5173',
        'X-Title': process.env.YOUR_SITE_NAME || 'AI Live Chat',
      },
    });
  }
  return openaiClient;
};

const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '500', 10);
const TEMPERATURE = parseFloat(process.env.TEMPERATURE || '0.7');
const MODEL = process.env.MODEL || 'openai/gpt-3.5-turbo';

export interface LLMError {
  type: 'api_error' | 'rate_limit' | 'invalid_key' | 'timeout' | 'network' | 'invalid_response' | 'unknown';
  message: string;
  retryable: boolean;
  statusCode?: number;
}

export interface LLMResponse {
  success: boolean;
  reply?: string;
  error?: LLMError;
  tokensUsed?: number;
  model?: string;
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay with jitter
 */
const calculateBackoffDelay = (retryCount: number): number => {
  const baseDelay = 1000; // 1 second
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd
  return Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
};

/**
 * Build conversation context for LLM
 */
const buildConversationContext = (
  conversationHistory: Message[],
  userMessage: string,
  maxHistory: number
): OpenAI.Chat.ChatCompletionMessageParam[] => {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
  ];

  // Add recent conversation history
  const recentHistory = conversationHistory.slice(-maxHistory);
  for (const msg of recentHistory) {
    messages.push({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text,
    });
  }

  // Add current user message
  messages.push({
    role: 'user',
    content: userMessage,
  });

  return messages;
};

/**
 * Create user-friendly error from API error
 */
const createLLMError = (error: any, retryCount: number, maxRetries: number): LLMError => {
  // Timeout error
  if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
    return {
      type: 'timeout',
      message: 'The request took too long. Please try again.',
      retryable: retryCount < maxRetries,
    };
  }

  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ECONNRESET') {
    return {
      type: 'network',
      message: 'Unable to connect to AI service. Please check your internet connection.',
      retryable: retryCount < maxRetries,
    };
  }

  // Authentication errors
  if (error.status === 401 || error.status === 403) {
    return {
      type: 'invalid_key',
      message: 'Authentication failed. Please contact support.',
      retryable: false,
      statusCode: error.status,
    };
  }

  // Rate limiting
  if (error.status === 429) {
    return {
      type: 'rate_limit',
      message: 'Too many requests. Please wait a moment and try again.',
      retryable: retryCount < maxRetries,
      statusCode: 429,
    };
  }

  // Server errors (retryable)
  if (error.status >= 500 && error.status < 600) {
    return {
      type: 'api_error',
      message: 'AI service is temporarily unavailable. Please try again in a moment.',
      retryable: retryCount < maxRetries,
      statusCode: error.status,
    };
  }

  // Bad request errors (not retryable)
  if (error.status === 400) {
    return {
      type: 'invalid_response',
      message: 'Invalid request. Please try rephrasing your message.',
      retryable: false,
      statusCode: 400,
    };
  }

  // Unknown errors
  return {
    type: 'unknown',
    message: 'An unexpected error occurred. Please try again.',
    retryable: retryCount < maxRetries,
  };
};

/**
 * Generate AI reply using OpenRouter API with retry logic and comprehensive error handling
 * @param conversationHistory - Array of previous messages in the conversation
 * @param userMessage - The current user message
 * @param retryCount - Current retry attempt (used internally)
 * @returns LLMResponse object with reply or error
 */
export const generateAIReply = async (
  conversationHistory: Message[],
  userMessage: string,
  retryCount: number = 0
): Promise<LLMResponse> => {
  const config = LLMConfig.getInstance();
  
  try {
    const openai = getOpenAIClient();
    
    // Build conversation context
    const messages = buildConversationContext(
      conversationHistory,
      userMessage,
      config.maxHistoryMessages
    );

    // Call OpenRouter API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const completion = await openai.chat.completions.create(
        {
          model: config.model,
          messages,
          max_tokens: config.maxTokens,
          temperature: config.temperature,
          stream: false,
        },
        {
          signal: controller.signal as any,
        }
      );

      clearTimeout(timeoutId);

      // Validate response
      const reply = completion.choices[0]?.message?.content;
      if (!reply || reply.trim().length === 0) {
        return {
          success: false,
          error: {
            type: 'invalid_response',
            message: 'AI generated an empty response. Please try again.',
            retryable: retryCount < config.maxRetries,
          },
        };
      }

      return {
        success: true,
        reply: reply.trim(),
        tokensUsed: completion.usage?.total_tokens,
        model: completion.model,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error: any) {
    console.error(`LLM Error (attempt ${retryCount + 1}/${config.maxRetries}):`, {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    const llmError = createLLMError(error, retryCount, config.maxRetries);

    // Retry logic for retryable errors
    if (llmError.retryable && retryCount < config.maxRetries) {
      const delay = calculateBackoffDelay(retryCount);
      console.log(`Retrying in ${delay}ms (attempt ${retryCount + 1}/${config.maxRetries})`);
      await sleep(delay);
      return generateAIReply(conversationHistory, userMessage, retryCount + 1);
    }

    return {
      success: false,
      error: llmError,
    };
  }
};

/**
 * Validate that OpenRouter API is configured correctly
 */
export const validateLLMConfig = (): boolean => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY is not set in environment variables');
      return false;
    }
    
    const config = LLMConfig.getInstance();
    console.log('✅ LLM Configuration validated:');
    console.log(`   Model: ${config.model}`);
    console.log(`   Max Tokens: ${config.maxTokens}`);
    console.log(`   Temperature: ${config.temperature}`);
    console.log(`   Max Retries: ${config.maxRetries}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error validating LLM configuration:', error);
    return false;
  }
};

/**
 * Health check for LLM service
 * Tests basic connectivity without consuming many tokens
 */
export const checkLLMHealth = async (): Promise<boolean> => {
  try {
    const testResponse = await generateAIReply([], 'Hello', 0);
    return testResponse.success;
  } catch (error) {
    console.error('LLM health check failed:', error);
    return false;
  }
};

/**
 * Get LLM service statistics (for monitoring/debugging)
 */
export const getLLMStats = () => {
  const config = LLMConfig.getInstance();
  return {
    model: config.model,
    maxTokens: config.maxTokens,
    temperature: config.temperature,
    maxRetries: config.maxRetries,
    timeout: config.timeout,
    provider: 'OpenRouter',
    configured: !!process.env.OPENROUTER_API_KEY,
  };
};
