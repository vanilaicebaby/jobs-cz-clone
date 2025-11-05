import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imageTransition, setImageTransition] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        await new Promise(resolve => setTimeout(resolve, 300));
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (index) => {
    if (index !== selectedImage) {
      setImageTransition(true);
      setTimeout(() => {
        setSelectedImage(index);
        setImageTransition(false);
      }, 150);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity}x ${product.name} přidáno do košíku!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-normal text-gray-900 mb-4">Produkt nenalezen</h2>
        <Link to="/" className="text-gray-600 hover:text-gray-900 underline">
          Zpět na homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in">
        <nav className="text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="animate-fade-in stagger-1 opacity-0">
            {/* Main Image */}
            <div className="mb-4 bg-white overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={`w-full h-auto object-cover transition-all duration-300 ${
                  imageTransition ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`border overflow-hidden transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-gray-900 scale-105'
                      : 'border-gray-200 hover:border-gray-400 hover:scale-105'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-auto object-cover transition-opacity duration-200 hover:opacity-80"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in stagger-2 opacity-0">
            <h1 className="text-2xl font-normal text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-2xl font-medium text-gray-900 mb-6">
              {product.price.toLocaleString('cs-CZ')} Kč
            </p>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-6 border-t border-gray-200 pt-6 animate-fade-in-up stagger-3 opacity-0">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                TECHNICKÉ SPECIFIKACE
              </h3>
              <dl className="space-y-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between text-sm hover:bg-gray-50 transition-colors duration-200 px-2 py-1 rounded">
                    <dt className="text-gray-600">{spec.label}:</dt>
                    <dd className="text-gray-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Features */}
            <div className="mb-8 border-t border-gray-200 pt-6 animate-fade-in-up stagger-4 opacity-0">
              <h3 className="text-sm font-medium text-gray-900 mb-3">VÝHODY</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm hover:translate-x-1 transition-transform duration-200">
                    <svg
                      className="w-5 h-5 text-gray-900 mt-0.5 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="border-t border-gray-200 pt-6 animate-fade-in-up stagger-5 opacity-0">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-900">Množství:</label>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-4 px-6 text-sm font-medium hover:bg-gray-800 transition-all duration-300 btn-hover-lift"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 border-2 border-black text-black py-4 px-6 text-sm font-medium hover:bg-black hover:text-white transition-all duration-300 btn-hover-lift"
                >
                  BUY NOW
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <svg
                    className="w-5 h-5 text-gray-900 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Skladem - expedice do 2 pracovních dnů
                </div>
                <div className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <svg
                    className="w-5 h-5 text-gray-900 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Doprava ZDARMA při nákupu nad 10 000 Kč
                </div>
                <div className="flex items-center hover:translate-x-1 transition-transform duration-200">
                  <svg
                    className="w-5 h-5 text-gray-900 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  2 roky záruka na všechny produkty
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
