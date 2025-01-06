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

      // Format the phone number to ensure it starts with +964
      const formattedPhone = phone.startsWith('+964') ? phone : `+964${phone.replace(/^0+/, '')}`;

      // Check if this is Dr. Ali Kamal's credentials
      const isAdminSignup = formattedPhone === '+9647705449905' && password === 'A.K.M.S.22';

      // Check if profile already exists
      const { data: existingProfile, error: queryError } = await supabase
        .from('profiles')
        .select('phone')
        .eq('phone', formattedPhone)
        .maybeSingle();

      if (queryError) {
        console.error("Profile query error:", queryError);
        toast.error("Could not check existing profiles");
        return;
      }

      if (existingProfile) {
        toast.error("An account with this phone number already exists");
        return;
      }

      // Create profile with phone and password
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          phone: formattedPhone,
          password,
          auth_method: 'password',
          role: isAdminSignup ? 'admin' : 'patient',
          full_name: isAdminSignup ? 'Dr. Ali Kamal' : null
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Could not create account. Please try again.");
        return;
      }

      // Store the phone number in localStorage for future use
      localStorage.setItem('userPhone', formattedPhone);
      
      toast.success("Account created successfully!");
      
      // Redirect based on role
      if (isAdminSignup) {
        navigate("/admin");
      } else {
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