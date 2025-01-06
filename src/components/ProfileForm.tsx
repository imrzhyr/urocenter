import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplaintInput } from "./medical-reports/ComplaintInput";
import type { Profile } from "@/hooks/useProfile";

interface ProfileFormProps {
  profile: Profile;
  onProfileChange: (field: keyof Profile, value: string) => void;
}

export const ProfileForm = ({
  profile,
  onProfileChange,
}: ProfileFormProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={profile.full_name}
          onChange={(e) => {
            const names = e.target.value.split(' ').map(name => 
              name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
            ).join(' ');
            onProfileChange('full_name', names);
          }}
          placeholder="Enter your full name (at least two names)"
          className={`${profile.full_name.split(' ').length < 2 ? 'border-red-500' : ''}`}
        />
        {profile.full_name && profile.full_name.split(' ').length < 2 && (
          <p className="text-sm text-red-500">Please enter at least two names</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <Select 
          value={profile.gender} 
          onValueChange={(value) => onProfileChange('gender', value)}
        >
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
          value={profile.age}
          onChange={(e) => onProfileChange('age', e.target.value)}
          placeholder="Enter your age"
        />
      </div>

      <ComplaintInput 
        complaint={profile.complaint} 
        setComplaint={(value) => onProfileChange('complaint', value)} 
      />
    </div>
  );
};