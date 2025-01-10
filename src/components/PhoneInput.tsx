import { Input } from "@/components/ui/input";
import { PhoneFormatter } from "./phone/PhoneFormatter";
import { VerificationButton } from "./phone/VerificationButton";
import { SignInButton } from "./phone/SignInButton";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

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

  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const renderPasswordRequirement = (met: boolean, text: string) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 text-sm"
    >
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
      <span className={met ? "text-green-700" : "text-red-700"}>
        {text}
      </span>
    </motion.div>
  );

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
            className={`pr-10 transition-colors duration-200 ${
              password && (isPasswordStrong ? 'border-green-500 focus-visible:ring-green-500' : 'border-red-500 focus-visible:ring-red-500')
            }`}
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence>
          {password && isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1 mt-2"
            >
              {renderPasswordRequirement(passwordStrength.hasMinLength, t("at_least_chars"))}
              {renderPasswordRequirement(passwordStrength.hasUpperCase, t("one_uppercase"))}
              {renderPasswordRequirement(passwordStrength.hasLowerCase, t("one_lowercase"))}
              {renderPasswordRequirement(passwordStrength.hasNumber, t("one_number"))}
              {renderPasswordRequirement(passwordStrength.hasSpecialChar, t("one_special"))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isSignUp ? (
        <motion.div className="space-y-4">
          <VerificationButton 
            phone={value} 
            password={password} 
            onSuccess={onSignUpSuccess} 
          />
          <p className="text-center text-sm text-muted-foreground">
            {t('already_have_account')}{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-primary hover:underline font-medium"
            >
              {t('sign_in')}
            </button>
          </p>
        </motion.div>
      ) : (
        <motion.div className="space-y-4">
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
        </motion.div>
      )}
    </div>
  );
};