import React, { useState } from 'react';
import { 
  ChromeIcon, 
  Apple, 
  Linkedin, 
  Mail, 
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function AuthModal({ isOpen, onClose, initialMode = 'login', onLogin }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const socialProviders = [
    { icon: ChromeIcon, text: 'Pokračovat s Google', provider: 'google' },
    { icon: Apple, text: 'Pokračovat s Apple', provider: 'apple' },
    { icon: Linkedin, text: 'Pokračovat s LinkedIn', provider: 'linkedin' },
    { icon: Mail, text: 'Pokračovat s Outlookem', provider: 'outlook' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = mode === 'login' ? '/login' : '/register';
      const payload = mode === 'login' 
        ? { email, password }
        : { email, password, confirmPassword };

      const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Úspěšné přihlášení/registrace
        localStorage.setItem('token', data.token);
        
        // Volání onLogin props, pokud existuje
        if (onLogin) {
          onLogin();
        }

        // Zavření modálu a přesměrování na feed
        onClose();
        navigate('/feed');
      } else {
        // Chyba přihlášení/registrace
        setError(data.message || 'Něco se pokazilo');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Nastala chyba při připojení k serveru');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Zde byste implementovali logiku sociálního přihlášení
    alert(`Sociální přihlášení přes ${provider} není implementováno`);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-modal" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>{mode === 'login' ? 'Přihlášení' : 'Registrace'}</h2>

        <div className="social-login-buttons">
          {socialProviders.map((provider, index) => (
            <button 
              key={index} 
              className="social-login-button"
              onClick={() => handleSocialLogin(provider.provider)}
            >
              <provider.icon className="social-login-icon" size={20} />
              {provider.text}
            </button>
          ))}
        </div>

        <div className="auth-divider">
          <div className="auth-divider-line"></div>
          <span className="auth-divider-text">nebo</span>
          <div className="auth-divider-line"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Heslo</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>Potvrzení hesla</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
          )}

          {mode === 'login' && (
            <div className="forgot-password">
              <a href="#">Zapomenuté heslo?</a>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={isLoading}
          >
            {isLoading 
              ? (mode === 'login' ? 'Přihlašování...' : 'Registrace...') 
              : (mode === 'login' ? 'Přihlásit se' : 'Zaregistrovat se')
            }
          </button>

          <div className="auth-switch">
            {mode === 'login' 
              ? 'Nemáte účet?' 
              : 'Máte již účet?'}
            <button 
              type="button" 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              disabled={isLoading}
            >
              {mode === 'login' ? 'Zaregistrujte se' : 'Přihlaste se'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;