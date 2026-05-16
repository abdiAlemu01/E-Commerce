import { useTranslation } from 'react-i18next';

const AdminProducts = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('admin.manageProducts')}</h1>
        <button className="btn btn-primary">{t('admin.addProduct')}</button>
      </div>

      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          No products yet. Add your first product to get started!
        </p>
      </div>
    </div>
  );
};

export default AdminProducts;
