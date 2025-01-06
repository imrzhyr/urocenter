import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface ComplaintInputProps {
  complaint: string;
  setComplaint: (value: string) => void;
  required?: boolean;
}

const complaintExamples = [
  "Kidney pain with frequent urination",
  "Blood in urine with flank pain",
  "Difficulty urinating with prostate concerns",
  "Recurring kidney stones with severe pain",
  "Lower urinary tract symptoms",
  "Swelling in legs with decreased urination",
];

export const ComplaintInput = ({
  complaint,
  setComplaint,
  required = false
}: ComplaintInputProps) => {
  const [placeholderText, setPlaceholderText] = useState(complaintExamples[0]);
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % complaintExamples.length);
      setPlaceholderText(complaintExamples[(exampleIndex + 1) % complaintExamples.length]);
    }, 3000);

    return () => clearInterval(interval);
  }, [exampleIndex]);

  return (
    <div className="space-y-2">
      <Label htmlFor="complaint">Medical Complaint *</Label>
      <textarea
        id="complaint"
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder={placeholderText}
        className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        required={required}
      />
    </div>
  );
};