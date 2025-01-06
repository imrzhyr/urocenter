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
      
      // Generate a UUID for the new profile
      const { data: { user_id }, error: uuidError } = await supabase.rpc('gen_random_uuid');
      
      if (uuidError) {
        console.error("UUID generation error:", uuidError);
        toast.error("Failed to create account");
        return;
      }

      // Insert into profiles table with the generated UUID
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user_id,
          phone,
          auth_method: 'phone'
        });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
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