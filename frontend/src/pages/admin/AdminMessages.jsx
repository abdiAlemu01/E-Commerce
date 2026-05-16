import { useTranslation } from 'react-i18next';

const AdminMessages = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customer Support</h1>
      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          Real-time customer support messaging coming soon!
        </p>
      </div>
    </div>
  );
};

export default AdminMessages;
