import { Input } from "@/components/ui/input";
import { PhoneFormatter } from "./PhoneFormatter";
import { VerificationButton } from "./VerificationButton";
import { SignInButton } from "./SignInButton";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  isSignUp?: boolean;
  onSignUpSuccess?: () => void;
}

export const PhoneInput = ({ value, onChange, isSignUp = false, onSignUpSuccess }: PhoneInputProps) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <PhoneFormatter value={value} onChange={onChange} />
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('enter_password')}
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
        <div className="space-y-4">
          <VerificationButton phone={value} password={password} onSuccess={onSignUpSuccess} />
          <p className="text-center text-sm text-muted-foreground">
            {t('dont_have_account')}{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-primary hover:underline font-medium"
            >
              {t('sign_in')}
            </button>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <SignInButton phone={value} password={password} />
          <p className="text-center text-sm text-muted-foreground">
            {t('dont_have_account')}{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-primary hover:underline font-medium"
            >
              {t('sign_up')}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};