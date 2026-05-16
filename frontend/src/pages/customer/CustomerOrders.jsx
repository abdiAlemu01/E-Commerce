import { useTranslation } from 'react-i18next';

const CustomerOrders = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('order.orderHistory')}</h1>
      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          No orders yet. Start shopping to see your orders here!
        </p>
      </div>
    </div>
  );
};

export default CustomerOrders;
