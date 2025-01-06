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
    if (!phone || phone.length !== 11) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Iraqi phone number",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
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

      const { data, error } = await supabase.auth.signUp({
        phone: formattedPhone,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        navigate("/profile");
      }
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

  const isDisabled = !phone || phone.length !== 11 || !password || password.length < 6 || isLoading;

  return (
    <Button 
      onClick={handleSignUp} 
      disabled={isDisabled}
      className="w-full"
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      Sign Up
    </Button>
  );
};