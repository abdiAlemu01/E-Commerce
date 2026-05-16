import { useTranslation } from 'react-i18next';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage } from 'react-icons/fi';

const AdminDashboard = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: FiDollarSign,
      label: t('admin.totalSales'),
      value: '$0',
      color: 'bg-green-500',
    },
    {
      icon: FiShoppingBag,
      label: t('admin.totalOrders'),
      value: '0',
      color: 'bg-blue-500',
    },
    {
      icon: FiUsers,
      label: t('admin.totalCustomers'),
      value: '0',
      color: 'bg-purple-500',
    },
    {
      icon: FiPackage,
      label: t('admin.totalProducts'),
      value: '0',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No orders yet.
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Low Stock Products</h2>
          <p className="text-gray-600 dark:text-gray-400">
            All products are well stocked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
