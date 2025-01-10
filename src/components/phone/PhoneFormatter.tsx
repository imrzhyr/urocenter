import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { formatPhoneNumber } from "@/utils/phoneUtils";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFormatter = ({ value, onChange }: PhoneFormatterProps) => {
  const [touched, setTouched] = useState(false);
  const { t, language } = useLanguage();
  
  const isValidIraqiNumber = value ? /^\+964[0-9]{10}$/.test(formatPhoneNumber(value)) : true;
  const showError = touched && !isValidIraqiNumber && value !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setTouched(true);
  };

  return (
    <div className="space-y-2">
      <Input
        type="tel"
        value={value}
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