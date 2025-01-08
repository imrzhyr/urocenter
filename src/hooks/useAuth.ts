import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber, normalizePhoneNumber } from "@/utils/phoneUtils";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First normalize the phone number
      let normalizedPhone = normalizePhoneNumber(phone);
      
      // Log the normalized phone for debugging
      console.log("Raw phone input:", phone);
      console.log("Normalized phone:", normalizedPhone);
      
      // Fetch profile with normalized phone
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, phone, password, role')
        .eq('phone', normalizedPhone)
        .eq('password', password)
        .order('created_at', { ascending: false })
        .limit(1);

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

      const profile = profiles[0];
      console.log("Found profile:", { phone: profile.phone, role: profile.role });

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