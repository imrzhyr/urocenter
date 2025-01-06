import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneFormatter } from "./phone/PhoneFormatter";
import { VerificationButton } from "./phone/VerificationButton";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  isSignUp?: boolean;
}

export const PhoneInput = ({ value, onChange, isSignUp = false }: PhoneInputProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <PhoneFormatter value={value} onChange={onChange} readOnly={isSignUp} />
        </div>
      </div>

      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
      )}

      <div className="flex justify-end">
        <VerificationButton phone={value} password={password} isSignUp={isSignUp} />
      </div>
    </div>
  );
};