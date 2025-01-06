import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface VerificationButtonProps {
  phone: string;
  password: string;
  isSignUp?: boolean;
}

export const VerificationButton = ({ phone, password, isSignUp = false }: VerificationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    cleaned = cleaned.replace(/^0+/, '');
    
    if (cleaned.startsWith('7')) {
      cleaned = '964' + cleaned;
    }
    
    if (!cleaned.startsWith('964')) {
      cleaned = '964' + cleaned;
    }
    
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  const handleSignUp = async () => {
    if (!phone || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      const formattedPhone = formatPhoneNumber(phone);

      const { data, error } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: password,
      });

      if (error) {
        console.error('Sign up error:', error);
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        toast.success("Sign up successful! Please sign in.");
        navigate("/signin");
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      onClick={handleSignUp}
      disabled={!phone || !password || password.length < 6 || isLoading}
    >
      {isLoading ? "Processing..." : "Sign up"}
    </Button>
  );
};