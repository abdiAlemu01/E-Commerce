import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import {
  FiHome,
  FiShoppingBag,
  FiUser,
  FiHeart,
  FiMessageSquare,
  FiPackage,
  FiUsers,
  FiGrid,
  FiTag,
} from 'react-icons/fi';

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuthStore();

  const customerLinks = [
    { to: '/customer', icon: FiHome, label: t('nav.dashboard') },
    { to: '/customer/orders', icon: FiShoppingBag, label: t('nav.orders') },
    { to: '/customer/wishlist', icon: FiHeart, label: t('nav.wishlist') },
    { to: '/customer/profile', icon: FiUser, label: t('nav.profile') },
    { to: '/customer/messages', icon: FiMessageSquare, label: t('nav.messages') },
  ];

  const adminLinks = [
    { to: '/admin', icon: FiHome, label: t('nav.dashboard') },
    { to: '/admin/products', icon: FiPackage, label: t('common.products') },
    { to: '/admin/orders', icon: FiShoppingBag, label: t('nav.orders') },
    { to: '/admin/customers', icon: FiUsers, label: t('nav.customers') },
    { to: '/admin/categories', icon: FiGrid, label: t('nav.categories') },
    { to: '/admin/coupons', icon: FiTag, label: t('nav.coupons') },
    { to: '/admin/messages', icon: FiMessageSquare, label: t('nav.messages') },
  ];

  const links = user?.role === 'admin' ? adminLinks : customerLinks;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
