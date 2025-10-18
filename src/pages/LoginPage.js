import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import config from '../config';

function LoginPage({ openAuthModal, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Úspěšné přihlášení
        localStorage.setItem('token', data.token);
        
        // Volání onLogin prop
        if (onLogin) {
          onLogin();
        }

        // Přesměrování na feed
        navigate('/feed');
      } else {
        // Chyba přihlášení
        setError(data.message || 'Přihlášení selhalo');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Nastala chyba při připojení k serveru');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Zde byste implementovali logiku zapomenutého hesla
    alert('Funkce resetování hesla není implementována');
  };

  return (
    <div className="login-page">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        <ChevronLeft size={24} /> Zpět
      </button>

      <div className="login-container">
        <h1 className="login-title">Přihlášení</h1>
        <p className="login-subtitle">Zadejte své přihlašovací údaje</p>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              className="form-input"
              placeholder="vas.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Heslo</label>
            <input 
              type="password" 
              id="password"
              className="form-input"
              placeholder="Vaše heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="login-actions">
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember" 
                disabled={isLoading}
              />
              <label htmlFor="remember">Zapamatovat</label>
            </div>
            <button 
              type="button" 
              className="forgot-password"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              Zapomenuté heslo?
            </button>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
          </button>

          <div className="register-link">
            Nemáte účet? 
            <button 
              type="button" 
              onClick={() => openAuthModal('register')}
              disabled={isLoading}
            >
              Zaregistrujte se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;