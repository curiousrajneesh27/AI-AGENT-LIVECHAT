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

export const chatAPI = {
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to send message');
    }

    return response.json();
  },

  getHistory: async (conversationId: string): Promise<HistoryResponse> => {
    const response = await fetch(`${API_BASE_URL}/chat/history/${conversationId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch conversation history');
    }

    return response.json();
  },
};
