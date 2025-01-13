import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  useEffect(() => {
    if (profile) {
      if (profile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/chat');
      }
    } else {
      navigate('/signin');
    }
  }, [profile, navigate]);

  return null;
};

export default Index;