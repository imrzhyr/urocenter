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
      // Using email authentication with phone as the email
      const { data, error } = await supabase.auth.signUp({
        email: `${phone.replace(/\D/g, '')}@example.com`,
        password,
        options: {
          data: {
            phone: phone, // Store the phone number in user metadata
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        toast.success("Account created successfully!");
        navigate("/profile");
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
      onClick={handleSignUp}
      className="w-full"
      disabled={!isValid || isLoading}
    >
      {isLoading ? "Creating account..." : "Create account"}
    </Button>
  );
};