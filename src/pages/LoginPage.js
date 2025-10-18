import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../utils/mockData';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Mockup přihlášení
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      // Úspěšné přihlášení - přesměrování na feed
      navigate('/feed');
    } else {
      setError('Neplatný email nebo heslo');
    }
  };

  return (
    <div className="login-page">
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
            />
          </div>

          <div className="login-actions">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Zapamatovat</label>
            </div>
            <button type="button" className="forgot-password">Zapomenuté heslo?</button>
          </div>

          <button 
            type="submit" 
            className="login-button"
          >
            Přihlásit se
          </button>

          <div className="register-link">
            Nemáte účet? <button type="button" onClick={() => navigate('/')}>Zaregistrujte se</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;