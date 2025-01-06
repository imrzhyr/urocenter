import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber, normalizePhoneNumber } from "@/utils/phoneUtils";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      const formattedPhone = formatPhoneNumber(phone);
      const normalizedPhone = normalizePhoneNumber(phone);

      console.log("Attempting to sign in with phone:", formattedPhone);
      
      // First verify the phone exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, phone, password, role')
        .filter('phone', 'ilike', `%${normalizedPhone}`)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("An error occurred while signing in");
        return null;
      }

      if (!profiles) {
        console.log("No profile found for phone:", formattedPhone);
        toast.error("Invalid phone number or password");
        return null;
      }

      // Then verify the password
      if (profiles.password !== password) {
        console.log("Password mismatch for phone:", formattedPhone);
        toast.error("Invalid phone number or password");
        return null;
      }

      // Update last login
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('phone', profiles.phone);

      if (updateError) {
        console.error("Failed to update last login:", updateError);
      }

      return profiles;

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