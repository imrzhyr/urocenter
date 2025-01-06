import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ComplaintInputProps {
  complaint: string;
  setComplaint: (value: string) => void;
  required?: boolean;
}

const complaintExamples = [
  "I have been experiencing back pain for 3 months",
  "I have frequent headaches",
  "My knee hurts when I walk",
  "I have difficulty sleeping",
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
        }, 2000);
      }

      if (isDeleting && currentIndex === 0) {
        isDeleting = false;
        currentExampleIndex = (currentExampleIndex + 1) % complaintExamples.length;
      }

      const speed = isDeleting ? 50 : 100;
      setTimeout(typeWriter, speed);
    };

    typeWriter();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="complaint">Medical Complaint</Label>
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