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
    let digits = phone.replace(/\D/g, '');
    
    // Remove leading zero if present
    if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    
    // If it starts with 964, remove it first
    if (digits.startsWith('964')) {
      digits = digits.slice(3);
    }
    
    // Add the +964 prefix
    return `+964${digits}`;
  };

  const handleSignIn = async () => {
    if (!isValid) {
      toast.error("Please enter a valid phone number and password");
      return;
    }

    try {
      setIsLoading(true);

      const formattedPhone = formatPhoneNumber(phone);
      console.log("Attempting sign in with:", { formattedPhone, password });

      // Query the profiles table to find the user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .eq('password', password)
        .maybeSingle();

      console.log("Profile query result:", { profile, profileError });

      if (profileError) {
        console.error("Profile query error:", profileError);
        toast.error("An error occurred while signing in");
        return;
      }

      if (!profile) {
        console.log("No profile found for:", { formattedPhone });
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