import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { ProgressSteps } from "@/components/ProgressSteps";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, isLoading } = useProfile();
  const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];

  const handleProfileChange = async (field: keyof typeof profile, value: string) => {
    const updatedProfile = {
      ...profile,
      [field]: value,
    };
    await updateProfile(updatedProfile);
  };

  const handleContinue = (e: React.MouseEvent) => {
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

    navigate("/medical-information");
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

          <div className="space-y-6">
            <ProfileForm
              profile={profile}
              onProfileChange={handleProfileChange}
            />

            <Button 
              onClick={handleContinue}
              className="w-full"
            >
              Continue to Medical Information
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;