import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber, normalizePhoneNumber } from "@/utils/phoneUtils";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      const normalizedPhone = normalizePhoneNumber(phone);
      
      console.log("Attempting to sign in with normalized phone:", normalizedPhone);
      
      // First verify the phone exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, phone, password, role')
        .eq('phone', normalizedPhone)
        .eq('password', password);

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("An error occurred while signing in");
        return null;
      }

      if (!profiles || profiles.length === 0) {
        console.log("No profile found for phone:", normalizedPhone);
        toast.error("Invalid phone number or password");
        return null;
      }

      // Get the most recently updated profile if there are multiple
      const profile = profiles[0];
      console.log("Found profile with phone:", profile.phone);

      // Update last login
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', profile.id);

      if (updateError) {
        console.error("Failed to update last login:", updateError);
      }

      return profile;

    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading
  };
};