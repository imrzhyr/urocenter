import { memo } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

interface ComplaintInputProps {
  complaint: string;
  setComplaint: (value: string) => void;
  required?: boolean;
}

export const ComplaintInput = memo(({
  complaint,
  setComplaint,
  required = false
}: ComplaintInputProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="complaint">
        {t('medical_complaint')}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        id="complaint"
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder={t('enter_complaint')}
        className="min-h-[100px] bg-white"
        required={required}
      />
    </div>
  );
});

ComplaintInput.displayName = "ComplaintInput";