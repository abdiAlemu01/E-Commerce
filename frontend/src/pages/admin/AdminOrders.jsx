import { useTranslation } from 'react-i18next';

const AdminOrders = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('admin.manageOrders')}</h1>
      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">No orders yet.</p>
      </div>
    </div>
  );
};

export default AdminOrders;
