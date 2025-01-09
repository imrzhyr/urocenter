import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VerificationButtonProps {
  phone: string;
  password: string;
  onSuccess?: () => void;
}

export const VerificationButton = ({ phone, password, onSuccess }: VerificationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!phone || !password) {
      toast.error("Please enter both phone number and password");
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = `+964${phone}`;
      localStorage.setItem('userPhone', formattedPhone);

      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .single();

      if (existingProfile) {
        toast.error("This phone number is already registered");
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            phone: formattedPhone,
            password: password,
            role: 'patient'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Sign up successful!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignUp}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? "Creating account..." : "Create account"}
    </Button>
  );
};