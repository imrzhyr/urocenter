import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "./useProfile";

export const useOnboarding = () => {
  const navigate = useNavigate();
  const { profile, isLoading, refetch } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in first");
        navigate("/signin");
        return false;
      }

      if (profile && profile.payment_status !== 'paid' && window.location.pathname !== '/payment') {
        toast.error("Please complete your payment to continue");
        navigate("/payment");
        return false;
      }

      return true;
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [navigate, isLoading, profile]);

  return {
    profile,
    isLoading,
    refetch
  };
};