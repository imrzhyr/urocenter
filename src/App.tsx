import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { AppRoutes } from './AppRoutes';

const App = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      navigate('/', { replace: true });
    } else if (profile?.id) {
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