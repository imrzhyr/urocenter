import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

let profileState: Profile = {
  id: "",
  full_name: "",
  gender: "",
  age: "",
  complaint: "",
  phone: "",
  role: "patient",
};

let listeners: ((profile: Profile) => void)[] = [];

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>(profileState);

  useEffect(() => {
    listeners.push(setProfile);
    return () => {
      listeners = listeners.filter(listener => listener !== setProfile);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        console.log("No user phone found in localStorage");
        return;
      }

      console.log("Fetching profile for phone:", userPhone);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', userPhone)
        .single();

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
        profileState = newProfile;
        listeners.forEach(listener => listener(newProfile));
      } else {
        console.log("No profile found for phone:", userPhone);
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Profile) => {
    try {
      setIsLoading(true);
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("No phone number found");
        return false;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updatedProfile,
          updated_at: new Date().toISOString(),
        })
        .eq('phone', userPhone);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }

      profileState = updatedProfile;
      listeners.forEach(listener => listener(updatedProfile));
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return false;
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
    profile,
    isLoading,
    updateProfile,
    setState: (newState: { profile: Profile }) => {
      profileState = newState.profile;
      listeners.forEach(listener => listener(newState.profile));
    }
  };
};

export type { Profile };