import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { motion } from "framer-motion";
import type { Profile } from "@/types/profile";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile: initialProfile, isLoading, updateProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: '',
    full_name: '',
    gender: '',
    age: '',
    complaint: '',
    phone: '',
    role: 'patient'
  });

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    const hasValidName = profile.full_name?.trim().split(' ').length >= 2;
    return hasValidName && 
      profile.gender && 
      profile.age && 
      profile.complaint;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfile(profile);
      if (success) {
        toast.success("Profile updated successfully");
        navigate("/medical-information");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Profile Information</h1>
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
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </Button>
    </motion.div>
  );
};

export default ProfilePage;