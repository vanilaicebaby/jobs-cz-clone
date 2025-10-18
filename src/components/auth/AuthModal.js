import React, { useState } from 'react';
import { 
  ChromeIcon, 
  Apple, 
  Linkedin, 
  Mail, 
  X 
} from 'lucide-react';

// Nahraďte mock uživatele buď prázdným polem, nebo odstraňte úplně
const MOCK_USERS = [
  {
    email: 'test@example.com',
    password: 'heslo123'
  }
];

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const user = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );

      if (user) {
        // Zde byste měli implementovat skutečné přihlášení přes API
        alert('Login successful!');
        onClose();
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Registrační logika
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Zde byste měli implementovat registraci přes API
      alert('Registration would be handled by API');
      setMode('login');
    }
  };

  // Zbytek kódu zůstává stejný
  // ...
}

export default AuthModal;