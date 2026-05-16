import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CustomerWishlist = () => {
  const { t } = useTranslation();
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product) => {
    addItem(product);
    toast.success('Added to cart');
  };

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">{t('nav.wishlist')}</h1>
        <div className="card text-center py-12">
          <FiHeart className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your wishlist is empty
          </p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('nav.wishlist')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <div key={product._id} className="card">
            <img
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <p className="text-primary-600 font-bold mb-4">${product.price}</p>

            <div className="flex space-x-2">
              <button
                onClick={() => handleAddToCart(product)}
                className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <FiShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={() => removeItem(product._id)}
                className="btn btn-secondary"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerWishlist;
