const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ChatResponse {
  success: boolean;
  reply?: string;
  sessionId: string;
  messageId?: string;
  timestamp?: string;
  error?: string;
}

export interface HistoryResponse {
  success: boolean;
  conversationId: string;
  messages: Message[];
  error?: string;
}

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 5000,
};

/**
 * Enhanced fetch with timeout support
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = 30000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new APIError('Request timed out. Please try again.', undefined, true);
    }
    throw error;
  }
};

/**
 * Determine if an error is retryable
 */
const isRetryableError = (error: any, statusCode?: number): boolean => {
  // Network errors are retryable
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  
  // Timeout errors are retryable
  if (error instanceof APIError && error.retryable) {
    return true;
  }
  
  // 5xx server errors are retryable
  if (statusCode && statusCode >= 500 && statusCode < 600) {
    return true;
  }
  
  // 429 rate limit is retryable
  if (statusCode === 429) {
    return true;
  }
  
  return false;
};

/**
 * Retry wrapper with exponential backoff
 */
const withRetry = async <T>(
  operation: () => Promise<T>,
  attemptNumber: number = 1
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const statusCode = error.statusCode;
    
    if (attemptNumber >= RETRY_CONFIG.maxAttempts || !isRetryableError(error, statusCode)) {
      throw error;
    }
    
    const delay = Math.min(
      RETRY_CONFIG.baseDelay * Math.pow(2, attemptNumber - 1),
      RETRY_CONFIG.maxDelay
    );
    
    console.log(`Retrying request (attempt ${attemptNumber + 1}/${RETRY_CONFIG.maxAttempts}) after ${delay}ms`);
    await sleep(delay);
    
    return withRetry(operation, attemptNumber + 1);
  }
};

export const chatAPI = {
  /**
   * Send a message and get AI response with automatic retry
   */
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    return withRetry(async () => {
      const response = await fetchWithTimeout(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new APIError(
          errorData.error || `Server error: ${response.status}`,
          response.status,
          response.status >= 500 || response.status === 429
        );
      }

      return response.json();
    });
  },

  /**
   * Get conversation history with automatic retry
   */
  getHistory: async (conversationId: string): Promise<HistoryResponse> => {
    return withRetry(async () => {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/chat/history/${conversationId}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new APIError(
          errorData.error || 'Failed to fetch conversation history',
          response.status,
          response.status >= 500
        );
      }

      return response.json();
    });
  },

  /**
   * Health check endpoint
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/chat/health`, {}, 5000);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },
};
