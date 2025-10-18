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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-card">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-300 mb-4">Přihlášení</h1>
          <p className="text-neutral-600 mb-6">Zadejte své přihlašovací údaje</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-neutral-700 mb-2">
              Email
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="vas.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-neutral-700 mb-2">
              Heslo
            </label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-200 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="Vaše heslo"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember"
                className="mr-2 text-primary-300 focus:ring-primary-300"
              />
              <label htmlFor="remember" className="text-neutral-600">
                Zapamatovat
              </label>
            </div>

            <a href="#" className="text-primary-300 hover:underline">
              Zapomenuté heslo?
            </a>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-primary-300 text-white rounded-lg 
            hover:bg-primary-400 transition-colors"
          >
            Přihlásit se
          </button>

          <div className="text-center">
            <p className="text-neutral-600">
              Nemáte účet? {' '}
              <a href="/" className="text-primary-300 hover:underline">
                Zaregistrujte se
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;