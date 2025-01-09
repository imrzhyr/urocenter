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
      console.log("Attempting to create account with:", { formattedPhone });
      
      // Store the phone number for later use
      localStorage.setItem('userPhone', formattedPhone);
      localStorage.setItem('userPassword', password);

      // Check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('phone', formattedPhone)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing profile:", fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        toast.error("This phone number is already registered");
        return;
      }

      // Create new profile
      const { data: newProfile, error: createError } = await supabase
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

      if (createError) {
        console.error("Error creating profile:", createError);
        throw createError;
      }

      console.log("Successfully created profile:", newProfile);
      toast.success("Account created successfully!");
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to create account. Please try again.");
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