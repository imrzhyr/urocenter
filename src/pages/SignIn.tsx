import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SignIn = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const formattedPhone = formatPhoneNumber(phone);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: formattedPhone,
        password: password,
      });

      if (error) {
        console.error('Auth error:', error);
        toast.error("Invalid phone number or password");
        return;
      }

      if (data?.user) {
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-4 flex justify-between items-center">
        <button 
          onClick={() => navigate("/")} 
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 container flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <PhoneInput value={phone} onChange={setPhone} />
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      placeholder="Password"
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
      </div>
    </div>
  );
};

export default SignIn;