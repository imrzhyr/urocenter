import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { motion } from "framer-motion";
import type { Profile } from "@/types/profile";

const ProfilePage = () => {
  const navigate = useNavigate();
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

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Form submission logic
      navigate("/medical-information");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </Button>
    </motion.div>
  );
};

export default ProfilePage;