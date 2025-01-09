import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

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

  return (
    <div>
      {/* Your existing routes and components go here */}
    </div>
  );
};

export default App;
