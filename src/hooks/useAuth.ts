import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber, normalizePhoneNumber } from "@/utils/phoneUtils";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Special handling for admin credentials
      const isAdminAttempt = phone === '7705449905' && password === 'A.K.M.S.22';
      
      // Format the phone number to ensure it starts with +964
      const formattedPhone = phone.startsWith('+964') ? phone : `+964${phone.replace(/^0+/, '')}`;
      
      console.log("Attempting sign in with:", {
        phone,
        formattedPhone,
        isAdminAttempt
      });
      
      // Fetch profile with formatted phone
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, phone, password, role, payment_status, payment_approval_status')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .order('created_at', { ascending: false })
        .limit(1);

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("An error occurred while signing in");
        return null;
      }

      if (!profiles || profiles.length === 0) {
        console.log("No profile found for phone:", formattedPhone);
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