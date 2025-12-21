import React, { useState, useEffect, useRef } from 'react';
import Message from './components/Message';
import TypingIndicator from './components/TypingIndicator';
import { chatAPI, Message as MessageType } from './api/chat';
import './App.css';

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
          text: "Hi! I'm your virtual support agent for TechGadget Store. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

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
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;

    // Clear error
    setError(null);

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
        setError(response.error || 'Failed to get response');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again.');
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

  const handleNewChat = () => {
    sessionStorage.removeItem('chatSessionId');
    setSessionId(undefined);
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "Hi! I'm your virtual support agent for TechGadget Store. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setError(null);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <h1>TechGadget Support</h1>
            <p>Ask me anything about our store!</p>
          </div>
          <button className="new-chat-btn" onClick={handleNewChat} title="Start new conversation">
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
              ⚠️ {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            disabled={isLoading}
            maxLength={2000}
          />
          <button 
            type="submit" 
            disabled={isLoading || !inputValue.trim()}
            className="send-button"
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
