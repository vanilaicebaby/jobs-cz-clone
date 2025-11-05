import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square w-full bg-gray-200 mb-3 skeleton"></div>
    <div className="h-10 bg-gray-200 mb-2 skeleton"></div>
    <div className="h-6 bg-gray-200 mb-3 w-1/2 skeleton"></div>
    <div className="h-12 bg-gray-200 skeleton"></div>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { name: 'Exteriér', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop' },
    { name: 'Interiér', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop' },
    { name: 'Performance', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop' },
    { name: 'Akce -20%', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop', isPromo: true }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Categories Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to="/"
                className={`group relative overflow-hidden bg-gray-200 h-32 animate-fade-in opacity-0 stagger-${index + 1} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  category.isPromo ? 'lg:col-span-1' : ''
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${
                  category.isPromo
                    ? 'bg-gradient-to-r from-black/70 to-black/50 group-hover:from-black/60 group-hover:to-black/40'
                    : 'bg-black/30 group-hover:bg-black/20'
                } transition-all duration-300`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className={`text-white font-medium transition-all duration-300 group-hover:scale-110 group-hover:tracking-wider ${
                    category.isPromo ? 'text-2xl font-bold' : 'text-lg'
                  }`}>
                    {category.name}
                  </h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
