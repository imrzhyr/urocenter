import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

export const useProfileActions = () => {
  const updateProfile = async (updatedProfile: Profile) => {
    try {
      const profileId = localStorage.getItem('profileId');
      console.log("Retrieved profileId from localStorage:", profileId);
      
      if (!profileId) {
        console.error("No profileId found in localStorage");
        toast.error("No profile ID found");
        return false;
      }

      console.log("Attempting to update profile with ID:", profileId);
      const updatePayload = {
        ...updatedProfile,
        id: profileId,
        updated_at: new Date().toISOString(),
      };
      console.log("Update payload:", updatePayload);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', profileId);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }

      console.log("Profile update successful");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  return {
    updateProfile
  };
};