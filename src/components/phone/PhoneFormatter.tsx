import { Input } from "@/components/ui/input";

interface PhoneFormatterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFormatter = ({ value, onChange }: PhoneFormatterProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
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
    <div className="flex gap-2">
      <div className="flex items-center px-3 border rounded-l bg-muted">
        +964
      </div>
      <Input
        id="phone"
        type="tel"
        className="rounded-l-none flex-1"
        value={formatPhoneNumber(value)}
        onChange={handleChange}
        placeholder="7XX XXX XXXX"
      />
    </div>
  );
};