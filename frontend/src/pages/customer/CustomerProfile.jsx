import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

const CustomerProfile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    language: user?.language || 'en',
    theme: user?.theme || 'light',
  });

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      updateUser(data.data);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('profile.myProfile')}</h1>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
            <input
              type="email"
              value={user?.email}
              className="input bg-gray-100 dark:bg-gray-700"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('profile.language')}</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="input"
            >
              <option value="en">English</option>
              <option value="om">Afaan Oromo</option>
              <option value="am">አማርኛ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('profile.theme')}</label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="input"
            >
              <option value="light">{t('profile.lightMode')}</option>
              <option value="dark">{t('profile.darkMode')}</option>
              <option value="system">System</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="btn btn-primary"
          >
            {updateProfileMutation.isPending ? t('common.loading') : t('common.save')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
