import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Nepodařilo se načíst objednávky');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Čeká na zpracování', color: 'bg-yellow-500' },
      processing: { label: 'Zpracovává se', color: 'bg-blue-500' },
      shipped: { label: 'Odesláno', color: 'bg-purple-500' },
      delivered: { label: 'Doručeno', color: 'bg-green-500' },
      cancelled: { label: 'Zrušeno', color: 'bg-red-500' },
    };

    const statusInfo = statusMap[status] || statusMap.pending;

    return (
      <span className={`${statusInfo.color} text-white text-xs px-2 py-1 rounded`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="mt-4">Načítám objednávky...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Moje Objednávky</h1>
          <p className="text-gray-400">Historie vašich objednávek</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="text-xl font-medium mb-2">Zatím žádné objednávky</h3>
            <p className="text-gray-400 mb-6">Začněte nakupovat a vaše objednávky se zobrazí zde.</p>
            <Link
              to="/products"
              className="inline-block bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition-colors"
            >
              Procházet Produkty
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-gray-800 rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-750 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">Objednávka č.</div>
                    <div className="font-mono text-lg">{order.id.slice(0, 8).toUpperCase()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Vytvořeno</div>
                    <div>{formatDate(order.createdAt)}</div>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-400">
                            Množství: {item.quantity} ks
                          </div>
                        </div>
                        <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-750 px-6 py-4 border-t border-gray-700 flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">Doručení na adresu</div>
                    <div className="text-sm">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city}{' '}
                      {order.deliveryAddress.postalCode}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Celková částka</div>
                    <div className="text-2xl font-bold">{formatPrice(order.totalAmount)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
