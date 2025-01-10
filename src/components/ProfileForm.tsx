import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ComplaintInput } from "./medical-reports/ComplaintInput";
import type { Profile } from "@/types/profile";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileFormProps {
  profile: Profile;
  onProfileChange: (field: keyof Profile, value: string) => void;
}

export const ProfileForm = memo(({
  profile,
  onProfileChange,
}: ProfileFormProps) => {
  const { t, language } = useLanguage();
  const hasValidName = profile.full_name?.trim().split(' ').length >= 2;

  return (
    <div className="space-y-6 bg-white rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t('full_name')}</Label>
        <Input
          id="fullName"
          value={profile.full_name || ""}
          onChange={(e) => {
            const names = e.target.value.split(' ').map(name => 
              name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
            ).join(' ');
            onProfileChange('full_name', names);
          }}
          placeholder={t('enter_full_name')}
          className={`${!hasValidName && profile.full_name ? 'border-red-500' : ''} bg-white`}
          required
        />
        {profile.full_name && !hasValidName && (
          <p className="text-sm text-red-500">{t('enter_full_name')}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>{t('gender')}</Label>
        <RadioGroup
          value={profile.gender || ""}
          onValueChange={(value) => onProfileChange('gender', value)}
          className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male" className="cursor-pointer">{t('male')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female" className="cursor-pointer">{t('female')}</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">{t('age')}</Label>
        <Input
          id="age"
          type="number"
          value={profile.age || ""}
          onChange={(e) => onProfileChange('age', e.target.value)}
          placeholder={t('enter_age')}
          required
          min="0"
          max="150"
          className="bg-white"
        />
      </div>

      <ComplaintInput 
        complaint={profile.complaint || ""} 
        setComplaint={(value) => onProfileChange('complaint', value)} 
        required
      />
    </div>
  );
});

ProfileForm.displayName = "ProfileForm";