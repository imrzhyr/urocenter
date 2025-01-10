import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFormatter = ({ value, onChange }: PhoneFormatterProps) => {
  const [touched, setTouched] = useState(false);
  const { t } = useLanguage();
  
  const isValidIraqiNumber = /^[0-9]{10}$/.test(value);
  const showError = touched && !isValidIraqiNumber;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
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
        className={`transition-colors duration-200 ${
          showError ? 'border-red-500 focus-visible:ring-red-500' : ''
        }`}
      />
      {showError && (
        <p className="text-sm text-red-500 mt-1 mb-4">
          {t('invalid_phone')}
        </p>
      )}
    </div>
  );
};