import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading, setState } = useProfile();

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    const updatedProfile = {
      ...profile,
      [field]: value,
    };
    setState({ profile: updatedProfile });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasValidName = profile.full_name?.trim().split(' ').length >= 2;
    const isFormValid = hasValidName && 
      profile.gender && 
      profile.age && 
      profile.complaint;

    if (!isFormValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const success = await updateProfile(profile);
    if (success) {
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
    <div className="min-h-screen bg-gradient-to-bl from-blue-50 via-white to-sky-50">
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-blue-900">Profile Information</h1>
            <p className="text-muted-foreground">
              Please fill in your profile details to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-blue-100 shadow-sm">
            <ProfileForm
              profile={profile}
              onProfileChange={handleProfileChange}
            />

            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue to Medical Information
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;