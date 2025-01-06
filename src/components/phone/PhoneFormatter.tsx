import { Input } from "@/components/ui/input";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const PhoneFormatter = ({ value, onChange, readOnly = false }: PhoneFormatterProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Remove any non-numeric characters except spaces
    val = val.replace(/[^\d\s]/g, "");
    
    // Remove all spaces to get just the numbers
    val = val.replace(/\s/g, "");
    
    // Remove the country code if present
    if (val.startsWith('964')) {
      val = val.slice(3);
    }
    
    // Remove leading zero if present
    if (val.startsWith('0')) {
      val = val.slice(1);
    }
    
    // Only update if we have 10 or fewer digits
    if (val.length <= 10) {
      onChange(val);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    
    // Remove any spaces first
    const cleaned = phone.replace(/\s/g, "");
    
    // Format the number as XXX XXX XXXX
    const match = cleaned.match(/^(\d{1,3})?(\d{1,3})?(\d{1,4})?$/);
    
    if (!match) return phone;

    const parts = [match[1], match[2], match[3]].filter(Boolean);
    return parts.join(" ");
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="flex items-center px-3 border rounded-l bg-muted min-w-[64px] justify-center">
        +964
      </div>
      <Input
        id="phone"
        type="text"
        className="rounded-l-none"
        value={formatPhoneNumber(value)}
        onChange={handleChange}
        placeholder="7XX XXX XXXX"
        readOnly={readOnly}
        autoComplete="tel"
        inputMode="numeric"
      />
    </div>
  );
};