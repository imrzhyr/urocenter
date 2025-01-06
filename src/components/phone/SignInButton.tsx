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

  const handleSignIn = async () => {
    if (!isValid) {
      toast.error("Please enter a valid phone number and password");
      return;
    }

    try {
      setIsLoading(true);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('password', password)
        .maybeSingle();

      if (profileError) {
        console.error("Profile query error:", profileError);
        toast.error("Could not verify credentials");
        return;
      }

      if (!profile) {
        toast.error("Invalid phone number or password");
        return;
      }

      // Update last login timestamp
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('phone', phone);

      if (updateError) {
        console.error("Failed to update last login:", updateError);
      }

      // Store the phone number in localStorage
      localStorage.setItem('userPhone', phone);
      
      toast.success("Signed in successfully!");
      navigate("/dashboard");

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