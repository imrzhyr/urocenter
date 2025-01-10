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
    
    const updatedProfile = {
      ...profile,
      [field]: value,
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
          }}
          onProfileChange={handleProfileChange}
        />
      </DialogContent>
    </Dialog>
  );
};