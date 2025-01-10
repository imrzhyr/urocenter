import React, { useEffect, useState } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  isSignUp?: boolean;
  onSignUpSuccess?: () => void;
}

export const PhoneInput = ({ value, onChange, isSignUp = false, onSignUpSuccess }: PhoneInputProps) => {
  const [phone, setPhone] = useState(value);

  useEffect(() => {
    setPhone(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhone(newValue);
    onChange(newValue);
  };

  const validatePhone = (phone: string) => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // For testing purposes, only allow 7700000000
    if (cleanPhone === '7700000000') {
      return true;
    }

    // For real numbers, maintain the original validation
    const isValidLength = cleanPhone.length === 10;
    const startsWithValidPrefix = ['770', '771', '772', '773', '774', '750', '751', '752', '753', '754', '780', '781', '782', '783', '784'].some(prefix => cleanPhone.startsWith(prefix));
    
    return isValidLength && startsWithValidPrefix;
  };

  const handleBlur = () => {
    if (isSignUp && validatePhone(phone)) {
      onSignUpSuccess && onSignUpSuccess();
    }
  };

  return (
    <div>
      <input
        type="tel"
        value={phone}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter your phone number"
        className="border rounded p-2 w-full"
      />
    </div>
  );
};