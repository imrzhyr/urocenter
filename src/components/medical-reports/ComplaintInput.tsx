import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComplaintInputProps {
  complaint: string;
  setComplaint: (value: string) => void;
  required?: boolean;
}

const complaintExamples = [
  "Frequent urination and lower back pain - possible kidney issue",
  "Blood in urine and flank pain - consult urologist",
  "Kidney stones with severe abdominal pain",
  "Difficulty urinating and frequent urges - prostate concern",
  "Swelling in legs and decreased urination - nephrology consultation",
  "Lower urinary tract symptoms with burning sensation",
];

export const ComplaintInput = ({ complaint, setComplaint, required }: ComplaintInputProps) => {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let currentExampleIndex = 0;

    const typeWriter = () => {
      const example = complaintExamples[currentExampleIndex];
      
      if (isDeleting) {
        setCurrentText(example.substring(0, currentIndex - 1));
        currentIndex--;
      } else {
        setCurrentText(example.substring(0, currentIndex + 1));
        currentIndex++;
      }

      if (!isDeleting && currentIndex === example.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 1500);
      }

      if (isDeleting && currentIndex === 0) {
        isDeleting = false;
        currentExampleIndex = (currentExampleIndex + 1) % complaintExamples.length;
      }

      const speed = isDeleting ? 30 : 50;
      setTimeout(typeWriter, speed);
    };

    typeWriter();

    return () => {
      setCurrentText("");
    };
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="complaint">Medical Complaint *</Label>
      <Input
        id="complaint"
        value={complaint}
        onChange={(e) => setComplaint(e.target.value)}
        placeholder={currentText}
        className="transition-all"
        required={required}
      />
    </div>
  );
};