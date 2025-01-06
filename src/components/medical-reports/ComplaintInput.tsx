import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
  const [placeholderText, setPlaceholderText] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typewriterDelay = isDeleting ? 30 : 50;
    const pauseDelay = 1500;

    const typewriter = () => {
      const currentExample = complaintExamples[exampleIndex];

      if (isDeleting) {
        setPlaceholderText(currentExample.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);

        if (charIndex <= 1) {
          setIsDeleting(false);
          setExampleIndex((prev) => (prev + 1) % complaintExamples.length);
          return;
        }
      } else {
        setPlaceholderText(currentExample.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);

        if (charIndex >= currentExample.length - 1) {
          setTimeout(() => setIsDeleting(true), pauseDelay);
          return;
        }
      }
    };

    const timer = setTimeout(typewriter, typewriterDelay);
    return () => clearTimeout(timer);
  }, [exampleIndex, charIndex, isDeleting]);

  return (
    <div className="space-y-2">
      <Label htmlFor="complaint">Medical Complaint *</Label>
      <textarea
        id="complaint"
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder={placeholderText}
        className="w-full min-h-[120px] p-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground/80 animate-typewriter focus:outline-none focus:ring-2 focus:ring-ring"
        required={required}
      />
    </div>
  );
};