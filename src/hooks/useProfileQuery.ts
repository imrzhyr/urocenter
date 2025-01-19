import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "sonner";
import { useProfileState } from "./useProfileState";

export const useProfileQuery = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setState } = useProfileState();

  const fetchProfile = async () => {
    try {
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
  }, []);

  return {
    isLoading,
    refetch: fetchProfile
  };
};