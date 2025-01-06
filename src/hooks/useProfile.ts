import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Profile {
  full_name: string;
  gender: string;
  age: string;
  complaint: string;
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    gender: "",
    age: "",
    complaint: "",
  });

  const fetchProfile = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        throw new Error("No phone number found");
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, gender, age, complaint')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          gender: profileData.gender || "",
          age: profileData.age || "",
          complaint: profileData.complaint || "",
        });
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
      const userPhone = localStorage.getItem('userPhone');
      
      if (!userPhone) {
        throw new Error("No phone number found");
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

      setProfile(updatedProfile);
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
  }, []);

  return {
    profile,
    isLoading,
    updateProfile,
  };
};