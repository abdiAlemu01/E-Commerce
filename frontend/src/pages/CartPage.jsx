import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/cartStore';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={64} />
        <h2 className="text-2xl font-bold mb-4">{t('cart.emptyCart')}</h2>
        <Link to="/products" className="btn btn-primary">
          {t('cart.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.yourCart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="card flex items-center space-x-4">
              <img
                src={item.product.images[0]?.url || '/placeholder.png'}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-primary-600 font-bold">${item.product.price}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                  className="btn btn-secondary px-3 py-1"
                >
                  -
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="btn btn-secondary px-3 py-1"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.product._id)}
                className="text-red-600 hover:text-red-700"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>{t('cart.total')}</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn btn-primary w-full mb-2">
              {t('cart.checkout')}
            </Link>
            
            <Link to="/products" className="btn btn-secondary w-full">
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
