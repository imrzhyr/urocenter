import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VerificationCodeProps {
  phone: string;
}

export const VerificationCode = ({ phone }: VerificationCodeProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        phone: `+964${phone}`,
        token: code,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });

      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Verification Code</Label>
        <div className="flex gap-2">
          <Input
            id="code"
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 6) setCode(val);
            }}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          <Button 
            onClick={handleVerify} 
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Verify
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter the verification code sent to +964 {phone}
      </p>
    </div>
  );
};