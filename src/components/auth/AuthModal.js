import React, { useState } from 'react';
import { 
  ChromeIcon, 
  Apple, 
  Linkedin, 
  Mail, 
  X 
} from 'lucide-react';
import { MOCK_USERS } from '../../utils/mockData';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const socialProviders = [
    { icon: ChromeIcon, text: 'Continue with Google', provider: 'google' },
    { icon: Apple, text: 'Continue with Apple', provider: 'apple' },
    { icon: Linkedin, text: 'Continue with LinkedIn', provider: 'linkedin' },
    { icon: Mail, text: 'Continue with Outlook', provider: 'outlook' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const user = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );

      if (user) {
        // Successful login
        alert('Login successful!');
        onClose();
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Registration logic
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        setError('Email already registered');
        return;
      }

      // Mock registration (in real app, you'd call backend)
      alert('Registration successful! Please log in.');
      setMode('login');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-modal" onClick={onClose}>
          <X size={24} />
        </button>

        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>

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

        <div className="auth-divider">
          <div className="auth-divider-line"></div>
          <span className="auth-divider-text">or</span>
          <div className="auth-divider-line"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input 
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>
          )}

{mode === 'login' && (
  <div className="forgot-password">
    <button 
      onClick={(e) => {
        e.preventDefault();
        alert('Forgot password functionality not implemented');
      }}
    >
      Forgot Password?
    </button>
  </div>
)}

          <button type="submit" className="auth-submit-btn">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="auth-switch">
          {mode === 'login' 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;