import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFormatter = ({ value, onChange }: PhoneFormatterProps) => {
  const [touched, setTouched] = useState(false);
  const { t, language, isRTL } = useLanguage();
  const [countryCode, setCountryCode] = useState("+964");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/\D/g, "");
    if (val.startsWith("964")) {
      val = val.slice(3);
    }
    while (val.startsWith("0")) {
      val = val.slice(1);
    }
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

  const displayValue = formatPhoneNumber(value);
  const showError = touched && !isValidIraqiNumber(value) && value !== "";

  return (
    <div className="space-y-2">
      <div className={cn(
        "flex",
        "h-[44px]", // iOS minimum touch target
        isRTL ? "flex-row-reverse" : "flex-row"
      )} dir="ltr">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              className={cn(
                "h-[44px]", // iOS minimum touch target
                "px-4",
                isRTL ? "rounded-l-none border-l-0" : "rounded-r-none border-r-0",
                "bg-white/80 dark:bg-[#1C1C1E]/80",
                "backdrop-blur-xl",
                "border-[#3C3C43]/20 dark:border-white/10",
                "text-[17px]", // iOS body text
                "text-[#000000] dark:text-white",
                "hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]",
                "focus:ring-1 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]",
                "transition-colors"
              )}
            >
              <Globe className="w-5 h-5 mr-2 text-[#8E8E93] dark:text-[#98989D]" />
              {countryCode}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCountryCode("+964")}>
              🇮🇶 Iraq (+964)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder={t('enter_phone')}
          className={cn(
            "flex-1",
            "h-[44px]", // iOS minimum touch target
            "px-4",
            isRTL ? "rounded-r-none" : "rounded-l-none",
            "bg-white/80 dark:bg-[#1C1C1E]/80",
            "backdrop-blur-xl",
            "border-[#3C3C43]/20 dark:border-white/10",
            "text-[17px]", // iOS body text
            "text-[#000000] dark:text-white",
            "placeholder:text-[#3C3C43]/60 dark:placeholder:text-[#98989D]/60",
            "focus:border-[#007AFF] dark:focus:border-[#0A84FF]",
            "focus:ring-1 focus:ring-[#007AFF] dark:focus:ring-[#0A84FF]",
            showError && "border-[#FF453A] focus:border-[#FF453A] focus:ring-[#FF453A]"
          )}
          dir="ltr"
        />
      </div>
      <AnimatePresence>
        {showError && (
          <motion.p 
            className={cn(
              "text-[13px]", // iOS caption text
              "text-[#FF453A]", // iOS system red
              "mt-1"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {t('invalid_phone')}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};