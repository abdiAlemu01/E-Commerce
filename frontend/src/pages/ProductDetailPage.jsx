import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
  });

  const product = data?.data;

  const handleAddToCart = () => {
    addItem(product);
    toast.success('Added to cart');
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast.success('Added to wishlist');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton h-96"></div>
          <div className="space-y-4">
            <div className="skeleton h-8"></div>
            <div className="skeleton h-4"></div>
            <div className="skeleton h-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.name}
            className="w-full rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl font-bold text-primary-600">
              ${product.price}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.comparePrice}
              </span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="flex items-center mb-4">
              <span className="text-yellow-500">⭐</span>
              <span className="ml-2">{product.rating.toFixed(1)}</span>
              <span className="ml-2 text-gray-600">({product.numReviews} reviews)</span>
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {product.description}
          </p>

          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm ${
              product.stock > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
            </span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <FiShoppingCart />
              <span>{t('product.addToCart')}</span>
            </button>
            
            <button
              onClick={handleAddToWishlist}
              disabled={isInWishlist(product._id)}
              className="btn btn-outline flex items-center justify-center space-x-2"
            >
              <FiHeart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
