import { Input } from "@/components/ui/input";
import { PhoneFormatter } from "./phone/PhoneFormatter";
import { VerificationButton } from "./phone/VerificationButton";
import { SignInButton } from "./phone/SignInButton";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  isSignUp?: boolean;
}

export const PhoneInput = ({ value, onChange, isSignUp = false }: PhoneInputProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex gap-2">
          <PhoneFormatter value={value} onChange={onChange} readOnly={isSignUp} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isSignUp ? (
        <>
          <div>
            <VerificationButton phone={value} password={password} />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </>
      ) : (
        <>
          <div>
            <SignInButton phone={value} password={password} />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </>
      )}
    </div>
  );
};