import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { AppRoutes } from './AppRoutes';

const App = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const location = useLocation();

  useEffect(() => {
    const userPhone = localStorage.getItem('userPhone');
    const isAuthRoute = ['/signin', '/signup'].includes(location.pathname);
    const isWelcomePage = location.pathname === '/';

    if (!userPhone && !isAuthRoute && !isWelcomePage) {
      navigate('/', { replace: true });
    } else if (userPhone && profile?.id && isWelcomePage) {
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [profile, navigate, location.pathname]);

  return <AppRoutes />;
};

export default App;