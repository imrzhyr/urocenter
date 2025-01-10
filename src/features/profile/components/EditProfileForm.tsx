import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import type { Profile } from "@/types/profile";
import { toast } from "sonner";

export const EditProfileForm = () => {
  const navigate = useNavigate();
  const { profile: initialProfile, isLoading, updateProfile } = useProfile();
  const [formData, setFormData] = useState<Profile>({
    id: "",
    full_name: "",
    gender: "",
    age: "",
    complaint: "",
    phone: "",
    role: "patient",
  });

  useEffect(() => {
    if (initialProfile) {
      setFormData(initialProfile);
    }
  }, [initialProfile]);

  const handleFieldChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    const hasValidName = formData.full_name.trim().split(' ').length >= 2;
    return hasValidName && 
      formData.gender && 
      formData.age && 
      formData.complaint;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const success = await updateProfile(formData);
    if (success) {
      toast.success("Profile updated successfully");
      navigate("/medical-information");
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
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-4 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Profile
            </h1>
            <p className="text-muted-foreground">
              Update your profile information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfileForm
              profile={formData}
              onProfileChange={handleFieldChange}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? "Updating..." : "Continue to Medical Information"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
