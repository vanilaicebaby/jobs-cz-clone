import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);

    // Add visual feedback
    const button = e.currentTarget;
    button.classList.add('scale-95');
    setTimeout(() => button.classList.remove('scale-95'), 100);

    // Show success message (you can replace with toast later)
    const originalText = button.textContent;
    button.textContent = '✓ ADDED';
    button.classList.add('bg-green-600');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-600');
    }, 1500);
  };

  return (
    <div
      className={`group animate-fade-in opacity-0 stagger-${(index % 8) + 1}`}
    >
      {/* Product Image - Fixed Size with Hover Effect */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden bg-white mb-3 image-hover-zoom"
      >
        <div className="aspect-square w-full relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="text-left">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm text-gray-900 mb-2 hover:text-gray-600 transition-colors duration-200 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        <p className="text-base font-medium text-gray-900 mb-3 transition-colors duration-200">
          {product.price.toLocaleString('cs-CZ')} Kč
        </p>

        {/* Add to Cart Button with Lift Effect */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white text-sm font-medium py-3 px-4 hover:bg-gray-800 transition-all duration-300 btn-hover-lift"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
