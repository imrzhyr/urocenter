import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFormatter = ({ value, onChange }: PhoneFormatterProps) => {
  const [touched, setTouched] = useState(false);
  const { t, language } = useLanguage();
  
  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    let digits = phone.replace(/\D/g, '');
    
    // Remove leading zeros
    while (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    
    // Ensure we don't exceed 10 digits (excluding country code)
    if (digits.length > 10) {
      digits = digits.slice(0, 10);
    }
    
    // Format the number with +964 prefix
    if (digits) {
      return `+964${digits}`;
    }
    
    return '';
  };

  const isValidIraqiNumber = (phone: string) => {
    return /^\+964[0-9]{10}$/.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    onChange(formattedNumber);
    setTouched(true);
  };

  const displayValue = value.startsWith('+964') ? value : formatPhoneNumber(value);
  const showError = touched && !isValidIraqiNumber(displayValue) && displayValue !== '';

  return (
    <div className="space-y-2">
      <Input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={t('enter_phone')}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        className={`transition-colors duration-200 text-${language === 'ar' ? 'right' : 'left'} ${
          showError ? 'border-red-500 focus-visible:ring-red-500' : ''
        }`}
      />
      {showError && (
        <p className="text-sm text-red-500 mt-1">
          {t('invalid_phone')}
        </p>
      )}
    </div>
  );
};