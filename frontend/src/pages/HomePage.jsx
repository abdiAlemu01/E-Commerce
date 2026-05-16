import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService } from '../services/productService';

const HomePage = () => {
  const { t } = useTranslation();

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: productService.getFeaturedProducts,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to E-Shop</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <Link to="/products" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t('product.featuredProducts')}</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-48 mb-4"></div>
                <div className="skeleton h-4 mb-2"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts?.data?.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product.slug}`}
                className="card hover:shadow-lg transition"
              >
                <img
                  src={product.images[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-primary-600 font-bold">${product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
