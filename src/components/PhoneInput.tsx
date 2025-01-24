import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export const PhoneInput = ({ value, onChange, error, className }: PhoneInputProps) => {
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
    <div className={cn("space-y-1", className)}>
      <div className="relative flex">
        <div className={cn(
          "flex items-center justify-center",
          "text-white",
          "bg-[#1C1C1E]",
          "w-[90px] h-12",
          "rounded-l-xl",
          "border border-r-0 border-white/[0.08]",
          "font-medium text-[15px]",
          "shadow-lg shadow-black/5"
        )}>
          +964
        </div>
        <Input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            "flex-1",
            "h-12 text-base rounded-l-none rounded-r-xl",
            "bg-[#1C1C1E] backdrop-blur-xl border border-white/[0.08] text-white",
            "hover:bg-[#1C1C1E]/70",
            "focus:outline-none focus:ring-0 focus:border-white/[0.08]",
            "transition-all duration-200",
            "placeholder:text-[#98989D]",
            "shadow-lg shadow-black/5",
            showError && "border-red-500/50",
            "tracking-wide" // Adds slight spacing between characters
          )}
          placeholder="7XX XXX XXXX"
        />
      </div>
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-500/90"
          >
            {t("invalid_phone")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};