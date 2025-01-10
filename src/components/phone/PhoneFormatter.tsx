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

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFormatter = ({ value, onChange }: PhoneFormatterProps) => {
  const [touched, setTouched] = useState(false);
  const { t, language } = useLanguage();
  const [countryCode, setCountryCode] = useState("+964");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Remove any non-digit characters and the country code if present
    val = val.replace(/\D/g, "");
    if (val.startsWith("964")) {
      val = val.slice(3);
    }
    
    // Remove leading zeros
    while (val.startsWith("0")) {
      val = val.slice(1);
    }
    
    // Limit to 10 digits (excluding country code)
    if (val.length <= 10) {
      onChange(val);
    }
    
    setTouched(true);
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    
    // Format the number with spaces
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
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className={`px-3 rounded-r-none border-r-0 ${
                language === 'ar' ? 'rounded-l border-l' : 'rounded-l-none border-l-0'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
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
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          className={`transition-colors duration-200 ${
            language === 'ar' ? 'rounded-r text-right' : 'rounded-l-none text-left'
          } ${
            showError ? 'border-red-500 focus-visible:ring-red-500' : ''
          }`}
        />
      </div>
      {showError && (
        <p className="text-sm text-red-500 mt-1">
          {t('invalid_phone')}
        </p>
      )}
    </div>
  );
};