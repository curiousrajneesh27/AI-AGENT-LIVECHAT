import React from 'react';
import './Message.css';

interface MessageProps {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({ sender, text, timestamp }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`message ${sender}`}>
      <div className="message-bubble">
        <div className="message-text">{text}</div>
        <div className="message-time">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
};

export default Message;
