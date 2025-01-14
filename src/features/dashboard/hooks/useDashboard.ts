import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

export const useDashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const userPhone = localStorage.getItem('userPhone');
      
      if (!userPhone) {
        navigate("/signin", { replace: true });
        return;
      }

      if (profile?.role === 'admin') {
        navigate("/admin", { replace: true });
      }
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [navigate, profile, isLoading]);

  return {
    profile,
    isLoading
  };
};