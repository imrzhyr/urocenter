import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

export const useOnboarding = () => {
  const navigate = useNavigate();
  const { profile, isLoading, refetch } = useProfile();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error(t("please_sign_in_first"));
        navigate("/signin");
        return false;
      }

      // Fetch the latest profile data directly from Supabase
      const { data: latestProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', userPhone)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return false;
      }

      if (!latestProfile) {
        return false;
      }

      console.log('Latest profile data:', latestProfile);

      const currentPath = window.location.pathname;

      // If user is paid and approved, redirect to dashboard unless they're already there
      if (latestProfile.payment_status === 'paid' && latestProfile.payment_approval_status === 'approved' && currentPath !== '/dashboard') {
        navigate("/dashboard");
        return true;
      }

      // Define the onboarding steps and their validation rules
      const steps = [
        {
          path: "/signup",
          isComplete: () => true, // Always allow signup
        },
        {
          path: "/profile",
          isComplete: () => Boolean(latestProfile.full_name && latestProfile.gender && latestProfile.age),
          redirectTo: "/signup",
          message: t("complete_signup_first")
        },
        {
          path: "/medical-information",
          isComplete: () => Boolean(latestProfile.full_name && latestProfile.gender && latestProfile.age),
          redirectTo: "/profile",
          message: t("complete_profile_first")
        },
        {
          path: "/payment",
          isComplete: () => Boolean(latestProfile.full_name && latestProfile.gender && latestProfile.age),
          redirectTo: "/medical-information",
          message: t("complete_medical_info_first")
        }
      ];

      // Find current step
      const currentStepIndex = steps.findIndex(step => step.path === currentPath);
      
      // If we're not on an onboarding page, don't interfere
      if (currentStepIndex === -1) return true;

      // Check if previous steps are complete
      for (let i = 0; i < currentStepIndex; i++) {
        if (!steps[i].isComplete()) {
          toast.error(steps[currentStepIndex].message);
          navigate(steps[i].redirectTo);
          return false;
        }
      }

      return true;
    };

    if (!isLoading) {
      checkAuth();
    }
  }, [navigate, isLoading, profile, t]);

  return {
    profile,
    isLoading,
    refetch
  };
};