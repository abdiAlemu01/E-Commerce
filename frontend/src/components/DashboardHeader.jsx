import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const DashboardHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success(t('auth.logoutSuccess'));
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 fixed top-0 left-0 right-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600">E-Shop Dashboard</h1>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
          >
            <option value="en">English</option>
            <option value="om">Afaan Oromo</option>
            <option value="am">አማርኛ</option>
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-red-600"
              title={t('common.logout')}
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
