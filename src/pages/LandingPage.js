import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  UserPlus, 
  ChromeIcon, 
  Apple, 
  Mail, 
  Linkedin 
} from 'lucide-react';

function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const socialProviders = [
    { icon: ChromeIcon, text: 'Pokračovat s Google', provider: 'google' },
    { icon: Apple, text: 'Pokračovat s Apple', provider: 'apple' },
    { icon: Linkedin, text: 'Pokračovat s LinkedIn', provider: 'linkedin' },
    { icon: Mail, text: 'Pokračovat s Outlookem', provider: 'outlook' }
  ];

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">Jobs.cz Clone</h1>
        <p className="landing-subtitle">Najděte svou vysněnou práci</p>

        <div className="tab-container">
          <button 
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Přihlášení
          </button>
          <button 
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Registrace
          </button>
        </div>

        <div className="social-login-buttons">
          {socialProviders.map((provider, index) => (
            <button 
              key={index} 
              className="social-login-button"
            >
              <provider.icon className="social-login-icon" size={20} /> 
              {provider.text}
            </button>
          ))}
        </div>

        <div className="landing-divider">
          <div className="landing-divider-line"></div>
          <span className="landing-divider-text">nebo</span>
          <div className="landing-divider-line"></div>
        </div>

        <button 
          className="main-action-button"
          onClick={() => navigate('/login')}
        >
          {activeTab === 'login' ? (
            <>
              <LogIn className="button-icon" size={20} /> Přihlásit se
            </>
          ) : (
            <>
              <UserPlus className="button-icon" size={20} /> Registrovat se
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default LandingPage;