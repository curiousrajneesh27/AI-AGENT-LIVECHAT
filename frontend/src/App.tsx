import React, { useState, useEffect, useRef, useCallback } from 'react';
import Message from './components/Message';
import TypingIndicator from './components/TypingIndicator';
import { chatAPI, Message as MessageType, APIError } from './api/chat';
import './App.css';

interface ConnectionStatus {
  isOnline: boolean;
  lastChecked: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isOnline: true,
    lastChecked: new Date(),
  });
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Check connection status periodically
  useEffect(() => {
    const checkConnection = async () => {
      const isHealthy = await chatAPI.checkHealth();
      setConnectionStatus({
        isOnline: isHealthy,
        lastChecked: new Date(),
      });
    };

    // Initial check
    checkConnection();

    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  // Load conversation history from sessionStorage on mount
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadHistory(storedSessionId);
    } else {
      // Add welcome message
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Hi! 👋 I'm your virtual support agent for TechGadget Store. I'm here to help with shipping, returns, product information, and any other questions you might have. How can I assist you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Focus input after loading or errors
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const loadHistory = async (conversationId: string) => {
    try {
      const response = await chatAPI.getHistory(conversationId);
      if (response.success && response.messages.length > 0) {
        setMessages(response.messages);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
      // If history fails, start fresh
      sessionStorage.removeItem('chatSessionId');
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Hi! 👋 I'm your virtual support agent for TechGadget Store. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;

    // Check connection
    if (!connectionStatus.isOnline) {
      setError('Unable to connect to server. Please check your internet connection and try again.');
      return;
    }

    // Clear error and reset retry count
    setError(null);
    setRetryCount(0);

    // Add user message optimistically
    const userMessage: MessageType = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      text: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(trimmedMessage, sessionId);

      if (response.success && response.reply) {
        // Store session ID
        if (response.sessionId && !sessionId) {
          setSessionId(response.sessionId);
          sessionStorage.setItem('chatSessionId', response.sessionId);
        }

        // Add AI response
        const aiMessage: MessageType = {
          id: response.messageId || `ai-${Date.now()}`,
          sender: 'ai',
          text: response.reply,
          timestamp: response.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (err: any) {
      console.error('Send message error:', err);
      
      let errorMessage = 'Sorry, something went wrong. Please try again.';
      
      if (err instanceof APIError) {
        errorMessage = err.message;
        if (err.retryable) {
          errorMessage += ' (Retrying automatically...)';
          setRetryCount((prev) => prev + 1);
        }
      } else if (err.message.includes('fetch') || err.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      
      // Remove the user message if failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleNewChat = useCallback(() => {
    sessionStorage.removeItem('chatSessionId');
    setSessionId(undefined);
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "Hi! 👋 I'm your virtual support agent for TechGadget Store. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setError(null);
    setRetryCount(0);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <h1>TechGadget Support</h1>
            <p>
              Ask me anything about our store!
              {!connectionStatus.isOnline && (
                <span className="connection-warning"> ⚠️ Connection issues detected</span>
              )}
            </p>
          </div>
          <button 
            className="new-chat-btn" 
            onClick={handleNewChat} 
            title="Start new conversation"
            aria-label="Start new conversation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <Message
              key={message.id}
              sender={message.sender}
              text={message.text}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && <TypingIndicator />}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
              <button 
                className="error-dismiss"
                onClick={dismissError}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
            rows={1}
            disabled={isLoading}
            maxLength={2000}
            aria-label="Message input"
          />
          <button 
            type="submit" 
            disabled={isLoading || !inputValue.trim() || !connectionStatus.isOnline}
            className="send-button"
            aria-label="Send message"
            title={!connectionStatus.isOnline ? "Connection issues" : "Send message"}
          >
            {isLoading ? (
              <span className="loading-spinner" aria-label="Sending"></span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </form>
        
        {retryCount > 0 && (
          <div className="retry-indicator">
            Retry attempt {retryCount}...
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
