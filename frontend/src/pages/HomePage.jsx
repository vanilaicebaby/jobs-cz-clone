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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Všechny produkty');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);

    if (categoryName === 'Všechny produkty') {
      setFilteredProducts(products);
    } else if (categoryName === 'Exteriér') {
      setFilteredProducts(products.filter(p => p.category && p.category.includes('Exteriér')));
    } else if (categoryName === 'Interiér') {
      setFilteredProducts(products.filter(p => p.category && p.category.includes('Interiér')));
    } else if (categoryName === 'Performance' || categoryName === 'Výfuk') {
      setFilteredProducts(products.filter(p => p.category && (p.category.includes('Výfuk') || p.category.includes('Performance'))));
    } else if (categoryName === 'Akce -20%') {
      // Filter products with isNew flag or random selection for demo
      setFilteredProducts(products.filter(p => p.isNew));
    }
  };

  const categories = [
    { name: 'Všechny produkty', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop' },
    { name: 'Exteriér', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&h=400&fit=crop' },
    { name: 'Interiér', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop' },
    { name: 'Performance', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop' }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Categories Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`group relative overflow-hidden bg-gray-200 h-32 animate-fade-in opacity-0 stagger-${index + 1} transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  selectedCategory === category.name ? 'ring-4 ring-black' : ''
                }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${
                  selectedCategory === category.name
                    ? 'bg-black/50 group-hover:bg-black/40'
                    : 'bg-black/30 group-hover:bg-black/20'
                } transition-all duration-300`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className={`text-white font-medium transition-all duration-300 group-hover:scale-110 group-hover:tracking-wider text-lg`}>
                    {category.name}
                  </h3>
                </div>
                <div className={`absolute inset-0 border-2 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'border-white/50'
                    : 'border-transparent group-hover:border-white/30'
                }`}></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-normal text-gray-900">
              {selectedCategory}
              <span className="text-sm text-gray-500 ml-3">
                ({loading ? '...' : filteredProducts.length} produktů)
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Žádné produkty v této kategorii.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
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
