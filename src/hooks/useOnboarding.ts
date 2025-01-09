import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "./useProfile";

export const useOnboarding = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    const checkAuth = () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in first");
        navigate("/signin");
        return false;
      }
      return true;
    };

    if (!isLoading) {
      const isAuthenticated = checkAuth();
      if (!isAuthenticated) return;
    }
  }, [navigate, isLoading]);

  return {
    profile,
    isLoading,
  };
};