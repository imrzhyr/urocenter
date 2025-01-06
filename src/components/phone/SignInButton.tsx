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

      if (profileError) throw profileError;

      if (!profile) {
        toast.error("Invalid phone number or password");
        setIsLoading(false);
        return;
      }

      // Sign in by creating a session for this profile
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: `${phone}@example.com`,
        password: password,
      });

      if (signInError) throw signInError;

      toast.success("Signed in successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in");
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