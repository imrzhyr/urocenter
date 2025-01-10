import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFormatter = ({ value, onChange }: PhoneFormatterProps) => {
  const [focused, setFocused] = useState(false);
  const { t } = useLanguage();

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    let formatted = cleaned;

    if (cleaned.length > 0) {
      formatted = `+${cleaned}`;
    }

    return formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="relative flex-1">
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t('enter_phone')}
        className={focused ? "pr-20" : ""}
      />
      {focused && (
        <div className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          {t('example')}: +1234567890
        </div>
      )}
    </div>
  );
};