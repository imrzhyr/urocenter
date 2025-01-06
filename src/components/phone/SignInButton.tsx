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

    setIsLoading(true);

    try {
      // Check if profile exists with this phone number and password
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .eq('password', password)
        .maybeSingle();

      if (profileError) {
        toast.error("An error occurred while signing in");
        return;
      }

      if (!profile) {
        toast.error("Invalid phone number or password");
        return;
      }

      // Create a session in localStorage to maintain login state
      localStorage.setItem('user_id', profile.id);
      localStorage.setItem('phone', phone);
      
      toast.success("Signed in successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An error occurred while signing in");
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