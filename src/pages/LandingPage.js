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

const SocialLoginButton = ({ icon: Icon, text, provider, onClick }) => (
  <button 
    onClick={onClick}
    className="social-login-button"
  >
    <Icon className="social-login-icon" size={20} />
    {text}
  </button>
);

function LandingPage({ openAuthModal }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  const socialProviders = [
    { 
      icon: ChromeIcon, 
      text: 'Pokračovat s Google', 
      provider: 'google',
      onClick: () => alert('Google přihlášení není implementováno')
    },
    { 
      icon: Apple, 
      text: 'Pokračovat s Apple', 
      provider: 'apple',
      onClick: () => alert('Apple přihlášení není implementováno')
    },
    { 
      icon: Linkedin, 
      text: 'Pokračovat s LinkedIn', 
      provider: 'linkedin',
      onClick: () => alert('LinkedIn přihlášení není implementováno')
    },
    { 
      icon: Mail, 
      text: 'Pokračovat s Outlookem', 
      provider: 'outlook',
      onClick: () => alert('Outlook přihlášení není implementováno')
    }
  ];

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">Jobs.cz Clone</h1>
        <p className="landing-subtitle">Najděte svou vysněnou práci</p>

        <div className="tab-container">
          <button 
            onClick={() => {
              setActiveTab('login');
              openAuthModal('login');
            }}
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          >
            Přihlášení
          </button>
          <button 
            onClick={() => {
              setActiveTab('register');
              openAuthModal('register');
            }}
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
          >
            Registrace
          </button>
        </div>

        <div className="social-login-buttons">
          {socialProviders.map((provider, index) => (
            <SocialLoginButton 
              key={index} 
              icon={provider.icon} 
              text={provider.text} 
              provider={provider.provider}
              onClick={provider.onClick}
            />
          ))}
        </div>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">nebo</span>
          <div className="divider-line"></div>
        </div>

        <button 
          onClick={() => {
            setActiveTab('login');
            navigate('/login');
          }}
          className="main-action-button"
        >
          {activeTab === 'login' ? (
            <>
              <LogIn className="button-icon" size={20} /> Přihlásit se
            </>
          ) : (
            <>
              <UserPlus className="button-icon" size={20} /> Zaregistrovat se
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default LandingPage;