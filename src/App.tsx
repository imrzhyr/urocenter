import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { AppRoutes } from './AppRoutes';

const App = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    if (profile?.id) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [profile, navigate]);

  return <AppRoutes />;
};

export default App;