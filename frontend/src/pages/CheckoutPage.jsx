import { useTranslation } from 'react-i18next';
import { useCartStore } from '../store/cartStore';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { items, getTotal } = useCartStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('cart.checkout')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="input" required />
                <input type="text" placeholder="Last Name" className="input" required />
              </div>
              <input type="email" placeholder="Email" className="input" required />
              <input type="tel" placeholder="Phone" className="input" required />
              <input type="text" placeholder="Address" className="input" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="input" required />
                <input type="text" placeholder="Zip Code" className="input" required />
              </div>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="radio" name="payment" value="card" defaultChecked />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="payment" value="cash" />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
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

            <button className="btn btn-primary w-full mt-6">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
