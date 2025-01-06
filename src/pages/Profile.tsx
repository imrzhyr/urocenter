import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { ProgressSteps } from "@/components/ProgressSteps";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading, setState } = useProfile();
  const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    // Just update the local state without calling updateProfile
    const updatedProfile = {
      ...profile,
      [field]: value,
    };
    // Update the local profile state without making an API call
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
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto py-6 px-4">
        <ProgressSteps steps={steps} currentStep={1} />
        <div className="space-y-6 mt-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Profile Information</h1>
            <p className="text-muted-foreground">
              Please fill in your profile details to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfileForm
              profile={profile}
              onProfileChange={handleProfileChange}
            />

            <Button 
              type="submit"
              className="w-full"
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