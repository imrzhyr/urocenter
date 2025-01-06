import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerificationButtonProps {
  phone: string;
  password: string;
}

export const VerificationButton = ({
  phone,
  password,
}: VerificationButtonProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isValid = phone.length > 0 && password.length >= 6;

  const handleSignUp = async () => {
    if (!isValid) {
      toast.error("Please enter a valid phone number and password");
      return;
    }

    try {
      setIsLoading(true);

      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        phone,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast.error(authError.message);
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create account");
        return;
      }

      // Then create their profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          phone,
          auth_method: 'phone'
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error(profileError.message);
        return;
      }

      toast.success("Account created successfully!");
      navigate("/profile");
      
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignUp}
      className="w-full"
      disabled={!isValid || isLoading}
    >
      {isLoading ? "Creating account..." : "Create account"}
    </Button>
  );
};