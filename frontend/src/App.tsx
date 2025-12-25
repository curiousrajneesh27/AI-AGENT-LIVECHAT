import React from 'react';
import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import ChatApp from './components/ChatApp';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="app loading-screen">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={login} />;
  }

  return <ChatApp />;
};

export default App;
