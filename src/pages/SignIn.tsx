import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters first
    let cleaned = phone.replace(/\D/g, '');
    // Remove leading zeros
    cleaned = cleaned.replace(/^0+/, '');
    // Add the country code if not present
    if (!cleaned.startsWith('964')) {
      cleaned = '964' + cleaned;
    }
    return '+' + cleaned;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error("Please enter both phone number and password");
      return;
    }

    try {
      setIsLoading(true);
      const formattedPhone = formatPhoneNumber(phone);

      console.log('Attempting sign in with:', {
        phone: formattedPhone,
        passwordLength: password.length,
        rawPhone: phone
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password: password,
      });

      if (error) {
        console.error('Auth error details:', {
          status: error.status,
          message: error.message,
          name: error.name,
          fullError: error
        });
        
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid phone number or password. Please try again.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data?.user) {
        console.log('Sign in successful:', {
          userId: data.user.id,
          phone: data.user.phone,
          metadata: data.user.user_metadata
        });
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <PhoneInput value={phone} onChange={setPhone} />
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!phone || !password || isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;