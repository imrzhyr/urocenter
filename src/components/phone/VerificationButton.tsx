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

      // First get a new UUID for the profile
      const { data: uuidData, error: uuidError } = await supabase
        .rpc('gen_random_uuid');

      if (uuidError || !uuidData?.[0]) {
        console.error("UUID generation error:", uuidError);
        toast.error("Failed to create account");
        return;
      }

      // Create profile with the generated UUID
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: uuidData[0].user_id,
          phone,
          auth_method: 'none'
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