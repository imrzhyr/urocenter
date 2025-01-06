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
      // First, check if profile exists with this phone number and password
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('password', password)
        .single();

      if (profileError || !profile) {
        toast.error("Invalid phone number or password");
        setIsLoading(false);
        return;
      }

      // Create a session by signing in with the user's ID
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${profile.id}@example.com`,
        password: password
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        toast.error("Error signing in");
        setIsLoading(false);
        return;
      }

      // Update last login timestamp
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', profile.id);

      toast.success("Signed in successfully!");
      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
    
    setIsLoading(false);
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