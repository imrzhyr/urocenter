import { Label } from "@/components/ui/label";
import { PhoneFormatter } from "./phone/PhoneFormatter";
import { VerificationButton } from "./phone/VerificationButton";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  isSignUp?: boolean;
}

export const PhoneInput = ({ value, onChange, isSignUp = false }: PhoneInputProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <PhoneFormatter value={value} onChange={onChange} readOnly={isSignUp} />
          <VerificationButton phone={value} isSignUp={isSignUp} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Enter your Iraqi phone number starting with 7
      </p>
    </div>
  );
};