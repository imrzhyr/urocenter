import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/ProfileForm";
import { useProfile } from "@/hooks/useProfile";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

interface NewEditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export const NewEditProfileDialog = ({ open, onClose }: NewEditProfileDialogProps) => {
  const { profile, updateProfile } = useProfile();

  const handleProfileChange = async (field: keyof Profile, value: string) => {
    if (!profile) return;
    
    const updatedProfile: Profile = {
      ...profile,
      [field]: value,
      password: profile.password || "" // Ensure password is included
    };
    
    const success = await updateProfile(updatedProfile);
    if (success) {
      toast.success("Profile updated successfully");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <ProfileForm
          profile={profile || {
            id: "",
            full_name: "",
            gender: "",
            age: "",
            complaint: "",
            phone: "",
            role: "patient",
            password: "" // Add required password field
          }}
          onProfileChange={handleProfileChange}
        />
      </DialogContent>
    </Dialog>
  );
};