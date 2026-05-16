import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  const verifyEmailMutation = useMutation({
    mutationFn: () => authService.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Verification failed');
    },
  });

  useEffect(() => {
    verifyEmailMutation.mutate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          <h2 className="text-3xl font-bold mb-4">Verifying Email...</h2>
          {verifyEmailMutation.isPending && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
