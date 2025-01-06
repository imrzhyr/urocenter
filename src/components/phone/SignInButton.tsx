import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SignInButtonProps {
  phone: string;
  password: string;
}

export const SignInButton = ({ phone, password }: SignInButtonProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isValid = phone.length > 0 && password.length >= 6;

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it doesn't start with +964, add it
    if (!phone.startsWith('+964')) {
      return `+964${digits}`;
    }
    return phone;
  };

  const handleSignIn = async () => {
    if (!isValid) {
      toast.error("Please enter a valid phone number and password");
      return;
    }

    try {
      setIsLoading(true);

      const formattedPhone = formatPhoneNumber(phone);
      console.log("Sign in attempt - Raw values:", { phone, password });
      console.log("Sign in attempt - Formatted values:", { formattedPhone, password });

      // First, let's check if the profile exists
      const { data: profiles, error: profileQueryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone);

      console.log("Profile query result:", { profiles, profileQueryError });

      if (profileQueryError) {
        console.error("Profile query error:", profileQueryError);
        toast.error("Could not verify credentials");
        return;
      }

      // Find the matching profile with the correct password
      const profile = profiles?.find(p => p.password === password);
      console.log("Password match result:", { found: !!profile });

      if (!profile) {
        toast.error("Invalid phone number or password");
        return;
      }

      // Update last login timestamp
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('phone', formattedPhone);

      if (updateError) {
        console.error("Failed to update last login:", updateError);
      }

      // Store the phone number in localStorage
      localStorage.setItem('userPhone', formattedPhone);
      
      toast.success("Signed in successfully!");
      
      // Redirect based on user role
      if (profile.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      className="w-full"
      disabled={!isValid || isLoading}
    >
      {isLoading ? "Signing in..." : "Sign in"}
    </Button>
  );
};