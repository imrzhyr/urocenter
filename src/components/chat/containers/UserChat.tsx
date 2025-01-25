import * as React from 'react';
import { useProfile } from '@/hooks/useProfile';
import { UserChatContainer } from '../UserChatContainer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const UserChat = React.memo(() => {
  const { profile, isLoading } = useProfile();
  const { t } = useLanguage();

  if (isLoading) {
    return <LoadingScreen message={t('loading')} />;
  }

  if (!profile) {
    return <Navigate to="/signin" replace />;
  }

  return <UserChatContainer userId={profile.id} />;
});

UserChat.displayName = 'UserChat'; 