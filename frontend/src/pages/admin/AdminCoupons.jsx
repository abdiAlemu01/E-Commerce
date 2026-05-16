import { useTranslation } from 'react-i18next';

const AdminCoupons = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('admin.manageCoupons')}</h1>
        <button className="btn btn-primary">Add Coupon</button>
      </div>

      <div className="card">
        <p className="text-gray-600 dark:text-gray-400">
          No coupons yet. Create discount coupons to boost sales!
        </p>
      </div>
    </div>
  );
};

export default AdminCoupons;
