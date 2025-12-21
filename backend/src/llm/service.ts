import OpenAI from 'openai';
import { Message } from '../database/services';
import { SYSTEM_PROMPT } from './knowledge';

// Initialize OpenRouter client lazily to ensure env vars are loaded
let openaiClient: OpenAI | null = null;

const getOpenAIClient = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
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
  type: 'api_error' | 'rate_limit' | 'invalid_key' | 'timeout' | 'unknown';
  message: string;
}

export interface LLMResponse {
  success: boolean;
  reply?: string;
  error?: LLMError;
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate AI reply using OpenRouter API with retry logic
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
  const MAX_RETRIES = 2;
  
  try {
    const openai = getOpenAIClient();
    
    // Build conversation context for the LLM
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
    ];

    // Add recent conversation history (last 10 messages)
    const recentHistory = conversationHistory.slice(-10);
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

    // Call OpenRouter API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const completion = await openai.chat.completions.create(
      {
        model: MODEL,
        messages: messages,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        stream: false,
      },
      {
        signal: controller.signal as any,
      }
    );

    clearTimeout(timeoutId);

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return {
        success: false,
        error: {
          type: 'unknown',
          message: 'No response generated from AI',
        },
      };
    }

    return {
      success: true,
      reply: reply.trim(),
    };
  } catch (error: any) {
    console.error('LLM Error:', error);

    // Handle specific error types
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: {
          type: 'timeout',
          message: 'Request timed out. Please try again.',
        },
      };
    }

    if (error.status === 401) {
      return {
        success: false,
        error: {
          type: 'invalid_key',
          message: 'Invalid API key. Please contact support.',
        },
      };
    }

    if (error.status === 429) {
      // Retry with exponential backoff for rate limits
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s...
        console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        return generateAIReply(conversationHistory, userMessage, retryCount + 1);
      }
      
      return {
        success: false,
        error: {
          type: 'rate_limit',
          message: 'Rate limit exceeded. Please wait a minute and try again.',
        },
      };
    }

    if (error.status >= 500) {
      return {
        success: false,
        error: {
          type: 'api_error',
          message: 'AI service is temporarily unavailable. Please try again later.',
        },
      };
    }

    return {
      success: false,
      error: {
        type: 'unknown',
        message: 'An unexpected error occurred. Please try again.',
      },
    };
  }
};

/**
 * Validate that OpenRouter API is configured correctly
 */
export const validateLLMConfig = (): boolean => {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not set in environment variables');
    return false;
  }
  return true;
};
