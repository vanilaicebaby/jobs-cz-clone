import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error || 'Přihlášení selhalo. Zkuste to prosím znovu.');
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    // Here you would integrate with Google OAuth
    console.log('Google login clicked');
    alert('Google OAuth integrace - implementujte ve vašem backend');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-2xl font-normal text-gray-900 mb-2">PŘIHLÁŠENÍ</h1>
          <p className="text-sm text-gray-600">
            Přihlaste se ke svému účtu
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 animate-fade-in-up stagger-1 opacity-0">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Heslo
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-gray-900"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Zapamatovat si mě</span>
            </label>
            <a href="#" className="text-gray-900 hover:underline">
              Zapomenuté heslo?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 px-4 text-sm font-medium hover:bg-gray-800 transition-all duration-300 btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PŘIHLAŠOVÁNÍ...' : 'PŘIHLÁSIT SE'}
          </button>
        </form>

        <div className="relative mb-6 animate-fade-in stagger-2 opacity-0">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">NEBO</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 btn-hover-lift flex items-center justify-center gap-3 animate-fade-in stagger-3 opacity-0"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Pokračovat s Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6 animate-fade-in stagger-4 opacity-0">
          Nemáte účet?{' '}
          <Link to="/register" className="text-gray-900 font-medium hover:underline transition-colors">
            Zaregistrujte se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
