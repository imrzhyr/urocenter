import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "sonner";
import { useProfileState } from "./useProfileState";

export const useProfileQuery = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setState, profile: cachedProfile } = useProfileState();

  const fetchProfile = async (force = false) => {
    try {
      // Only use cache for subsequent refreshes, not initial load
      if (cachedProfile?.role && !force) {
        setIsLoading(false);
        return;
      }

      // First try to get profile by ID
      const profileId = localStorage.getItem('profileId');
      if (profileId) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (!profileError && profileData) {
          const newProfile: Profile = {
            id: profileData.id,
            full_name: profileData.full_name || "",
            gender: profileData.gender || "",
            age: profileData.age || "",
            complaint: profileData.complaint || "",
            phone: profileData.phone || "",
            role: profileData.role,
            payment_status: profileData.payment_status || "unpaid",
            payment_approval_status: profileData.payment_approval_status || "pending",
            payment_method: profileData.payment_method,
            payment_date: profileData.payment_date
          };
          setState({ profile: newProfile });
          setIsLoading(false);
          return;
        }
      }

      // Fall back to phone number if profileId not found or query failed
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        setIsLoading(false);
        return;
      }

      // Ensure phone number has the + prefix
      const formattedPhone = userPhone.startsWith('+') ? userPhone : `+${userPhone}`;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
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
          role: profileData.role,
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

    // Set up realtime subscription using profileId if available
    const profileId = localStorage.getItem('profileId');
    if (profileId) {
      const channel = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${profileId}`
          },
          () => {
            // Force refresh on profile changes
            fetchProfile(true);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Fall back to phone subscription if no profileId
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) return;

    // Ensure phone number has the + prefix for realtime subscription
    const formattedPhone = userPhone.startsWith('+') ? userPhone : `+${userPhone}`;

    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `phone=eq.${formattedPhone}`
        },
        () => {
          // Force refresh on profile changes
          fetchProfile(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    isLoading,
    refetch: () => fetchProfile(true)
  };
};