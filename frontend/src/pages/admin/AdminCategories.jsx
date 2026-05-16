import { useTranslation } from 'react-i18next';

const AdminCategories = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('admin.manageCategories')}</h1>
        <button className="btn btn-primary">Add Category</button>
      </div>

      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          No categories yet. Add your first category to organize products!
        </p>
      </div>
    </div>
  );
};

export default AdminCategories;
