import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ComplaintInputProps {
  complaint: string;
  setComplaint: (value: string) => void;
  required?: boolean;
}

const complaintExamples = [
  "Kidney stones with severe flank pain",
  "Frequent urination and burning sensation",
  "Lower back pain with blood in urine",
  "Difficulty urinating with pelvic pressure",
  "Recurring urinary tract infections"
];

export const ComplaintInput = ({
  complaint,
  setComplaint,
  required = false
}: ComplaintInputProps) => {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    let currentExampleIndex = 0;
    let currentIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const example = complaintExamples[currentExampleIndex];

      if (isDeleting) {
        setCurrentText(example.substring(0, currentIndex - 1));
        currentIndex--;

        if (currentIndex === 0) {
          isDeleting = false;
          currentExampleIndex = (currentExampleIndex + 1) % complaintExamples.length;
        }
      } else {
        setCurrentText(example.substring(0, currentIndex + 1));
        currentIndex++;

        if (currentIndex === example.length) {
          isDeleting = true;
          setTimeout(() => {}, 1000); // Pause before deleting
        }
      }
    };

    const interval = setInterval(typeWriter, isDeleting ? 50 : 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="complaint">Medical Complaint *</Label>
      <Input
        id="complaint"
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder={currentText}
        className="placeholder:text-muted-foreground/80 animate-typewriter"
        required={required}
      />
    </div>
  );
};