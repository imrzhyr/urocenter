import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import type { Profile } from "@/types/profile";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useLanguage } from "@/contexts/LanguageContext";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile: initialProfile, isLoading, refetch } = useOnboarding();
  const { updateProfile } = useProfile();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: localStorage.getItem('profileId') || '',
    full_name: '',
    gender: '',
    age: '',
    complaint: '',
    phone: localStorage.getItem('userPhone') || '',
    role: 'patient'
  });

  useEffect(() => {
    if (initialProfile && !isLoading) {
      setProfile({
        ...initialProfile,
        phone: localStorage.getItem('userPhone') || initialProfile.phone || ''
      });
    }
  }, [initialProfile, isLoading]);

  const handleProfileChange = useCallback((field: keyof Profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
      phone: localStorage.getItem('userPhone') || prev.phone || ''
    }));
  }, []);

  const isFormValid = useCallback(() => {
    const hasValidName = profile.full_name?.trim().split(' ').length >= 2;
    return hasValidName && 
      profile.gender && 
      profile.age && 
      profile.complaint;
  }, [profile.full_name, profile.gender, profile.age, profile.complaint]);

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error(t('please_fill_all_fields'));
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfile(profile);
      if (success) {
        await refetch();
        navigate("/medical-information");
        toast.success(t('profile_updated'));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(t('profile_update_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message={t('loading')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto relative">
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('complete_profile')}
              </h1>
              <p className="text-muted-foreground">
                {t('profile_subtitle')}
              </p>
            </div>

            <ProfileForm 
              profile={profile}
              onProfileChange={handleProfileChange}
            />

            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                className="w-full h-[44px] text-[17px] font-medium rounded-xl bg-[#007AFF] hover:bg-[#0071E3] text-white"
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? t('updating') : t('continue')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;