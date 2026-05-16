import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { FiShoppingBag, FiHeart, FiPackage } from 'react-icons/fi';

const CustomerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const stats = [
    {
      icon: FiShoppingBag,
      label: t('nav.orders'),
      value: '0',
      color: 'bg-blue-500',
    },
    {
      icon: FiHeart,
      label: t('nav.wishlist'),
      value: '0',
      color: 'bg-red-500',
    },
    {
      icon: FiPackage,
      label: 'Delivered',
      value: '0',
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center space-x-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <p className="text-gray-600 dark:text-gray-400">
          No orders yet. Start shopping to see your orders here!
        </p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
