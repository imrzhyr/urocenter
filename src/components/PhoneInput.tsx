import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneInput = ({ value, onChange }: PhoneInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 11) {
      onChange(val);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const match = phone.match(/^(\d{4})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <div className="flex">
        <div className="flex items-center px-3 border rounded-l bg-muted">
          +964
        </div>
        <Input
          id="phone"
          type="tel"
          className="rounded-l-none"
          value={formatPhoneNumber(value)}
          onChange={handleChange}
          placeholder="7XX XXX XXXX"
        />
      </div>
    </div>
  );
};