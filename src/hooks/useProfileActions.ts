import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

export const useProfileActions = () => {
  const updateProfile = async (updatedProfile: Profile) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("No phone number found");
        return false;
      }

      console.log("Updating profile:", updatedProfile);

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