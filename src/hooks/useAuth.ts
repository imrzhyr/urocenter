import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/utils/phoneUtils";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      const formattedPhone = formatPhoneNumber(phone);

      // First verify the phone exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, phone, password, role')
        .eq('phone', formattedPhone)
        .single();

      if (profileError || !profile) {
        console.log("No profile found for phone:", formattedPhone);
        toast.error("Invalid phone number or password");
        return null;
      }

      // Then verify the password
      if (profile.password !== password) {
        console.log("Password mismatch for phone:", formattedPhone);
        toast.error("Invalid phone number or password");
        return null;
      }

      // Update last login
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('phone', formattedPhone);

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