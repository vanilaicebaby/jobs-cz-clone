import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { getCartCount } = useCart();

  return (
    <nav className="border-b border-gray-800 sticky top-0 z-50" style={{ backgroundColor: '#0d0e0e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo2.jpg"
              alt="BMW Carbon Parts"
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              PRODUKTY
            </Link>
            <Link
              to="/"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              KATEGORIE
            </Link>
            <a
              href="#"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              SLEDOVAT OBJEDNÁVKU
            </a>
            <a
              href="#"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              KONTAKT
            </a>
          </div>

          {/* Cart & Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-gray-900 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
