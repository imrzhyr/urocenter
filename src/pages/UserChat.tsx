import { useParams, Navigate } from 'react-router-dom';
import { DoctorChat as DoctorChatContainer } from '@/components/chat/containers';
import { useProfile } from '@/hooks/useProfile';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useLanguage } from '@/contexts/LanguageContext';

const UserChat = () => {
  const params = useParams<{ userId: string }>();
  const { profile, isLoading } = useProfile();
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingScreen message={t('loading')} />;
  }

  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  // First check if user is admin
  if (profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!params.userId) {
    return <Navigate to="/admin" replace />;
  }

  // Ensure we're not trying to chat with ourselves
  if (params.userId === profile.id) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DoctorChatContainer userId={params.userId} />
    </div>
  );
};

export default UserChat;