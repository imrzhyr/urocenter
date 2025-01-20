import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => {
  const { t, isRTL } = useLanguage();
  const [touched, setTouched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Remove non-digits
    val = val.replace(/\D/g, "");
    // Remove 964 if entered
    if (val.startsWith("964")) {
      val = val.slice(3);
    }
    // Remove leading zeros
    while (val.startsWith("0")) {
      val = val.slice(1);
    }
    // If empty and user starts typing, add "7"
    if (val.length === 1 && !val.startsWith("7")) {
      val = "7" + val;
    }
    // Limit to 10 digits
    if (val.length <= 10) {
      onChange(val);
    }
    setTouched(true);
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const match = phone.match(/^(\d{1,3})?(\d{1,3})?(\d{1,4})?$/);
    if (!match) return phone;
    const parts = [match[1], match[2], match[3]].filter(Boolean);
    return parts.join(" ");
  };

  const isValidIraqiNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return /^7\d{9}$/.test(digits);
  };

  const showError = touched && !isValidIraqiNumber(value) && value !== "";
  const displayValue = formatPhoneNumber(value);

  return (
    <div className="space-y-1">
      <div className="relative">
        <div className={cn(
          "absolute inset-y-0 flex items-center px-4 text-gray-500 bg-[#E5E9EF]",
          isRTL ? "right-0" : "left-0",
          "rounded-l-lg w-[90px] justify-center border-r border-gray-200"
        )}>
          +964
        </div>
        <Input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            isRTL ? "pl-3 pr-[90px]" : "pl-[98px] pr-3",
            "h-12 text-base rounded-lg bg-[#F1F5F9]",
            showError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-0",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            "tracking-wide" // Adds slight spacing between characters
          )}
          placeholder=""
        />
      </div>
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-500 mt-1"
          >
            {t("invalid_phone")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};