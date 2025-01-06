import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface VerificationButtonProps {
  phone: string;
  password: string;
  isSignUp?: boolean;
}

export const VerificationButton = ({ phone, password, isSignUp }: VerificationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (phone.length !== 11) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Iraqi phone number",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const phoneWithoutZero = phone.startsWith('0') ? phone.slice(1) : phone;
      const formattedPhone = `+964${phoneWithoutZero}`;

      const { error } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignUp) return null;

  return (
    <Button 
      onClick={handleSignUp} 
      disabled={phone.length !== 11 || password.length < 6 || isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      Sign Up
    </Button>
  );
};