import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  isSignUp?: boolean;
}

export const PhoneInput = ({ value, onChange, isSignUp = false }: PhoneInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 10) {
      onChange(val);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const match = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };

  const handleSendCode = async () => {
    if (value.length !== 10) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid Iraqi phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+964${value}`,
      });

      if (error) throw error;

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <div className="flex items-center px-3 border rounded-l bg-muted">
            +964
          </div>
          <Input
            id="phone"
            type="tel"
            className="rounded-l-none flex-1"
            value={formatPhoneNumber(value)}
            onChange={handleChange}
            placeholder="7XX XXX XXXX"
          />
          {isSignUp && (
            <Button 
              onClick={handleSendCode} 
              disabled={value.length !== 10 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Send Code
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter your Iraqi phone number starting with 7
      </p>
    </div>
  );
};