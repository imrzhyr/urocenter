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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return;
      }

      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, gender, age, complaint, phone, role')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
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
        };
        profileState = newProfile;
        listeners.forEach(listener => listener(newProfile));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Profile) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to update your profile");
        return false;
      }

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
    const setupAuthListener = () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchProfile();
        } else if (event === 'SIGNED_OUT') {
          profileState = {
            id: "",
            full_name: "",
            gender: "",
            age: "",
            complaint: "",
            phone: "",
            role: "patient",
          };
          listeners.forEach(listener => listener(profileState));
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    const unsubscribe = setupAuthListener();
    fetchProfile();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
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