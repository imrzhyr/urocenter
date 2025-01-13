import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

const Admin = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile) {
      navigate('/signin');
      return;
    }

    if (profile.role !== 'admin') {
      navigate('/chat');
    }
  }, [profile, navigate]);

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Admin Dashboard</h1>
        {/* Admin content will go here */}
      </div>
    </div>
  );
};

export default Admin;