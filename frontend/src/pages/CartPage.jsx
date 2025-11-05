import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-normal text-gray-900 mb-4">
            Váš košík je prázdný
          </h2>
          <p className="text-gray-600 mb-8">
            Přidejte produkty do košíku a pokračujte v nákupu
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-all duration-300 btn-hover-lift"
          >
            POKRAČOVAT V NÁKUPU
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-normal text-gray-900 mb-8 animate-fade-in">KOŠÍK</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-4 border border-gray-200 p-4 hover:border-gray-400 transition-all duration-300 animate-fade-in opacity-0 stagger-${(index % 8) + 1}`}
                >
                  <Link to={`/product/${item.id}`} className="flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-grow">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-sm font-normal text-gray-900 hover:text-gray-600 transition-colors mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-base font-medium text-gray-900 mb-3">
                      {item.price.toLocaleString('cs-CZ')} Kč
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-gray-600 hover:text-red-600 underline transition-colors duration-200"
                      >
                        Odebrat
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-medium text-gray-900">
                      {(item.price * item.quantity).toLocaleString('cs-CZ')} Kč
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 p-6 sticky top-24 animate-fade-in stagger-2 opacity-0">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                SOUHRN OBJEDNÁVKY
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm hover:bg-gray-50 transition-colors duration-200 px-2 py-1 rounded">
                  <span className="text-gray-600">Mezisoučet:</span>
                  <span className="text-gray-900">
                    {getCartTotal().toLocaleString('cs-CZ')} Kč
                  </span>
                </div>
                <div className="flex justify-between text-sm hover:bg-gray-50 transition-colors duration-200 px-2 py-1 rounded">
                  <span className="text-gray-600">Doprava:</span>
                  <span className="text-gray-900">
                    {getCartTotal() > 10000 ? 'ZDARMA' : '200 Kč'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">
                      Celkem:
                    </span>
                    <span className="text-lg font-medium text-gray-900">
                      {(getCartTotal() > 10000
                        ? getCartTotal()
                        : getCartTotal() + 200
                      ).toLocaleString('cs-CZ')}{' '}
                      Kč
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-black text-white text-center py-3 px-4 text-sm font-medium hover:bg-gray-800 transition-all duration-300 btn-hover-lift mb-3"
              >
                POKRAČOVAT K POKLADNĚ
              </Link>

              <Link
                to="/"
                className="block w-full text-center py-3 px-4 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                Pokračovat v nákupu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
