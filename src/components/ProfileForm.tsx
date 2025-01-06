import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProfileFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  age: string;
  setAge: (value: string) => void;
  complaint: string;
  setComplaint: (value: string) => void;
}

const complaintExamples = [
  "I have been experiencing back pain for 3 months",
  "I have frequent headaches",
  "My knee hurts when I walk",
  "I have difficulty sleeping",
];

export const ProfileForm = ({
  fullName,
  setFullName,
  gender,
  setGender,
  age,
  setAge,
  complaint,
  setComplaint,
}: ProfileFormProps) => {
  const [medicalReports, setMedicalReports] = useState<File[]>([]);
  const [currentExample, setCurrentExample] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const { toast } = useToast();

  // Typewriter effect
  useState(() => {
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

  const handleFileUpload = async (file: File) => {
    if (medicalReports.length >= 10) {
      toast({
        title: "Maximum limit reached",
        description: "You can only upload up to 10 medical reports",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('medical_reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('medical_reports')
        .insert({
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
        });

      if (dbError) throw dbError;

      setMedicalReports([...medicalReports, file]);
      toast({
        title: "File uploaded successfully",
        description: file.name,
      });
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setMedicalReports(medicalReports.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => {
            const names = e.target.value.split(' ').map(name => 
              name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
            ).join(' ');
            setFullName(names);
          }}
          placeholder="Enter your full name (at least two names)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger className="w-full transition-all hover:bg-accent">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent className="bg-card border-none shadow-lg">
            <SelectItem value="male" className="cursor-pointer hover:bg-accent transition-colors">Male</SelectItem>
            <SelectItem value="female" className="cursor-pointer hover:bg-accent transition-colors">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="complaint">Medical Complaint</Label>
        <Input
          id="complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder={currentText}
          className="transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label>Medical Reports</Label>
        <div className="grid grid-cols-2 gap-2">
          {medicalReports.map((file, index) => (
            <div key={index} className="relative bg-muted p-2 rounded-lg">
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs truncate">{file.name}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.jpg,.jpeg,.png';
              input.multiple = true;
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                  Array.from(files).forEach(handleFileUpload);
                }
              };
              input.click();
            }}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Implement camera capture functionality
              // This is a placeholder for now
              toast({
                title: "Camera capture",
                description: "This feature is coming soon",
              });
            }}
          >
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </Button>
        </div>
      </div>
    </div>
  );
};