import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "sonner";
import { useProfileState } from "./useProfileState";
import { useLocation } from "react-router-dom";

export const useProfileQuery = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setState } = useProfileState();
  const location = useLocation();

  const fetchProfile = async () => {
    try {
      if (location.pathname === '/signup' || location.pathname === '/signin' || location.pathname === '/') {
        setIsLoading(false);
        return;
      }

      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        setIsLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', userPhone)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (profileData) {
        const newProfile: Profile = {
          id: profileData.id,
          full_name: profileData.full_name || "",
          gender: profileData.gender || "",
          age: profileData.age || "",
          complaint: profileData.complaint || "",
          phone: profileData.phone || "",
          role: profileData.role || "patient",
          payment_status: profileData.payment_status || "unpaid",
          payment_approval_status: profileData.payment_approval_status || "pending",
          payment_method: profileData.payment_method,
          payment_date: profileData.payment_date
        };
        setState({ profile: newProfile });
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [location.pathname]);

  return {
    isLoading,
    refetch: fetchProfile
  };
};