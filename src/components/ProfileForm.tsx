import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicalReportUpload } from "./medical-reports/MedicalReportUpload";
import { ComplaintInput } from "./medical-reports/ComplaintInput";

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

      <ComplaintInput complaint={complaint} setComplaint={setComplaint} />
      
      <MedicalReportUpload />
    </div>
  );
};