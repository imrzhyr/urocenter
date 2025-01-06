import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useProfile, type Profile } from "@/hooks/useProfile";

export const EditProfileForm = () => {
  const navigate = useNavigate();
  const { profile, isLoading, updateProfile } = useProfile();
  const [formData, setFormData] = useState<Profile>(profile);

  const handleFieldChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      navigate("/dashboard");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-4 flex justify-between items-center">
        <button 
          onClick={() => navigate("/dashboard")} 
          className="p-2 hover:bg-muted rounded-full"
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
              disabled={
                !formData.full_name || 
                !formData.gender || 
                !formData.age || 
                !formData.complaint || 
                isLoading
              }
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};