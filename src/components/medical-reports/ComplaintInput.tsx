import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface ComplaintInputProps {
  complaint: string;
  setComplaint: (value: string) => void;
  required?: boolean;
}

const complaintExamples = {
  en: [
    "Kidney pain with frequent urination",
    "Blood in urine with flank pain",
    "Difficulty urinating with prostate concerns",
    "Recurring kidney stones with severe pain",
    "Lower urinary tract symptoms",
    "Swelling in legs with decreased urination",
  ],
  ar: [
    "ألم في الكلى مع تكرار التبول",
    "دم في البول مع ألم في الخاصرة",
    "صعوبة في التبول مع مشاكل في البروستاتا",
    "حصى الكلى المتكررة مع ألم شديد",
    "أعراض المسالك البولية السفلية",
    "تورم في الساقين مع انخفاض التبول",
  ],
};

export const ComplaintInput = ({
  complaint,
  setComplaint,
  required = false
}: ComplaintInputProps) => {
  const { t, language } = useLanguage();
  const [placeholderText, setPlaceholderText] = useState(complaintExamples[language][0]);
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % complaintExamples[language].length);
      setPlaceholderText(complaintExamples[language][(exampleIndex + 1) % complaintExamples[language].length]);
    }, 3000);

    return () => clearInterval(interval);
  }, [exampleIndex, language]);

  // Reset example index when language changes
  useEffect(() => {
    setExampleIndex(0);
    setPlaceholderText(complaintExamples[language][0]);
  }, [language]);

  return (
    <div className="space-y-2">
      <Label htmlFor="complaint">{t('medical_complaint')}</Label>
      <textarea
        id="complaint"
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder={placeholderText}
        className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        required={required}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />
    </div>
  );
};