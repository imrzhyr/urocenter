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
        console.log("No user phone found in localStorage");
        setIsLoading(false);
        return;
      }

      console.log("Fetching profile for phone:", userPhone);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      if (profileData) {
        console.log("Profile data fetched:", profileData);
        const newProfile: Profile = {
          id: profileData.id,
          full_name: profileData.full_name || "",
          gender: profileData.gender || "",
          age: profileData.age || "",
          complaint: profileData.complaint || "",
          phone: profileData.phone || "",
          role: profileData.role || "patient",
        };
        setState({ profile: newProfile });
      } else {
        console.log("No profile found for phone:", userPhone);
        const { data: newProfileData, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              phone: userPhone,
              role: 'patient',
              password: localStorage.getItem('userPassword') || ''
            }
          ])
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          throw createError;
        }

        if (newProfileData) {
          const newProfile: Profile = {
            id: newProfileData.id,
            full_name: "",
            gender: "",
            age: "",
            complaint: "",
            phone: userPhone,
            role: "patient",
          };
          setState({ profile: newProfile });
        }
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
        (payload) => {
          console.log('Profile change detected:', payload);
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