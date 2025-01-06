import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SignInButtonProps {
  phone: string;
  password: string;
}

export const SignInButton = ({ phone, password }: SignInButtonProps) => {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();

  const isValid = phone.length > 0 && password.length >= 6;

  const handleSignIn = async () => {
    if (!isValid) {
      toast.error("Please enter a valid phone number and password");
      return;
    }

    const profile = await signIn(phone, password);
    
    if (profile) {
      localStorage.setItem('userPhone', profile.phone);
      toast.success("Signed in successfully!");
      
      if (profile.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      className="w-full"
      disabled={!isValid || isLoading}
    >
      {isLoading ? "Signing in..." : "Sign in"}
    </Button>
  );
};