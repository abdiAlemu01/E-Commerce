import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast.success('Password reset email sent. Please check your inbox.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to send reset email');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <h2 className="text-3xl font-bold text-center mb-4">{t('auth.forgotPassword')}</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="btn btn-primary w-full"
            >
              {forgotPasswordMutation.isPending ? t('common.loading') : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            <Link to="/login" className="text-primary-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
