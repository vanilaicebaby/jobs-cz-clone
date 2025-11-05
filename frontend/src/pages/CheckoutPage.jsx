import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: user?.street || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    phone: user?.phone || '',
    country: user?.country || 'Česká republika',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Pro dokončení objednávky se musíte přihlásit');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        deliveryAddress: {
          street: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'card',
        totalAmount: getCartTotal() + (getCartTotal() > 10000 ? 0 : 200),
      };

      const response = await api.post('/orders', orderData);

      if (response.data.success) {
        clearCart();
        alert('Objednávka byla úspěšně vytvořena!');
        navigate('/orders');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.error || 'Nepodařilo se vytvořit objednávku');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const total = getCartTotal();
  const shipping = total > 10000 ? 0 : 200;
  const finalTotal = total + shipping;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-normal text-gray-900 mb-8 animate-fade-in">POKLADNA</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in stagger-1 opacity-0">
              {/* Contact Information */}
              <div className="border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  KONTAKTNÍ ÚDAJE
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  DODACÍ ADRESA
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Jméno *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Příjmení *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Adresa *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Město *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      PSČ *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  ZPŮSOB PLATBY
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      Platba kartou online
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="payment" className="mr-3" />
                    <span className="text-sm text-gray-700">
                      Platba na dobírku
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="payment" className="mr-3" />
                    <span className="text-sm text-gray-700">
                      Bankovní převod
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 p-6 sticky top-24 animate-fade-in stagger-2 opacity-0">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                VAŠE OBJEDNÁVKA
              </h2>

              <div className="space-y-3 mb-6 border-b border-gray-200 pb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-gray-900">
                      {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mezisoučet:</span>
                  <span className="text-gray-900">
                    {total.toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Doprava:</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'ZDARMA' : `${shipping} Kč`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">
                      Celkem:
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      {finalTotal.toLocaleString('cs-CZ')} Kč
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white py-3 px-4 text-sm font-medium hover:bg-gray-800 transition-all duration-300 btn-hover-lift disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'ZPRACOVÁVÁM...' : 'DOKONČIT OBJEDNÁVKU'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
