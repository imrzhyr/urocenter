import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VerificationButtonProps {
  phone: string;
  isSignUp?: boolean;
}

export const VerificationButton = ({ phone, isSignUp }: VerificationButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async () => {
    if (phone.length !== 11) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Iraqi phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const phoneWithoutZero = phone.startsWith('0') ? phone.slice(1) : phone;
      const formattedPhone = `+964${phoneWithoutZero}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        // Check if it's the Twilio verification error
        if (error.message.includes("unverified numbers")) {
          toast({
            title: "Development Mode Notice",
            description: "In development mode, phone numbers need to be verified in Twilio first. For testing, use code '123456'.",
          });
          // Still navigate to verify page in development
          return;
        }
        throw error;
      }

      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error sending code",
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
      onClick={handleSendCode} 
      disabled={phone.length !== 11}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      Send Code
    </Button>
  );
};