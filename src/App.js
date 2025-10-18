import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdvancedJobFeed from './pages/AdvancedJobFeed';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/auth/AuthModal';
import './index.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    closeAuthModal();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthModalOpen && (
          <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={closeAuthModal}
            initialMode={authMode}
            onLogin={handleLogin}
          />
        )}
        <Routes>
          {/* AdvancedJobFeed je nyní výchozí stránkou */}
          <Route 
            path="/" 
            element={<AdvancedJobFeed openAuthModal={openAuthModal} />} 
          />
          <Route 
            path="/landing" 
            element={<LandingPage openAuthModal={openAuthModal} />} 
          />
          <Route 
            path="/login" 
            element={
              <LoginPage 
                openAuthModal={() => openAuthModal('login')} 
                onLogin={handleLogin}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;