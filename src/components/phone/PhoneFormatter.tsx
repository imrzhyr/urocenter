import { Input } from "@/components/ui/input";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const PhoneFormatter = ({ value, onChange, readOnly = false }: PhoneFormatterProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    
    // Remove the country code if present
    if (val.startsWith('964')) {
      val = val.slice(3);
    }
    
    // Remove leading zero if present
    if (val.startsWith('0')) {
      val = val.slice(1);
    }
    
    if (val.length <= 10) {
      onChange(val);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const match = phone.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="flex items-center px-3 border rounded-l bg-muted min-w-[64px] justify-center">
        +964
      </div>
      <Input
        id="phone"
        type="tel"
        className="rounded-l-none"
        value={formatPhoneNumber(value)}
        onChange={handleChange}
        placeholder="07XX XXX XXXX"
        readOnly={readOnly}
        inputMode="numeric"
      />
    </div>
  );
};