import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import type { Profile } from "@/types/profile";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useOnboarding } from "@/hooks/useOnboarding";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile: initialProfile, isLoading, refetch } = useOnboarding();
  const { updateProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: '',
    full_name: '',
    gender: '',
    age: '',
    complaint: '',
    phone: localStorage.getItem('userPhone') || '',
    role: 'patient'
  });

  useEffect(() => {
    if (initialProfile && !isLoading) {
      setProfile(initialProfile);
    }
  }, [initialProfile, isLoading]);

  const handleProfileChange = useCallback((field: keyof Profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
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
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfile(profile);
      if (success) {
        // First update local state
        await refetch();
        // Then navigate
        navigate("/medical-information");
        // Show success toast after navigation
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Complete Your Profile</h1>
        <p className="text-muted-foreground">
          Please provide your basic information to continue
        </p>
      </div>

      <ProfileForm 
        profile={profile}
        onProfileChange={handleProfileChange}
      />

      <Button
        onClick={handleSubmit}
        disabled={!isFormValid() || isSubmitting}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </Button>
    </div>
  );
};

export default ProfilePage;