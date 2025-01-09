import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import type { Profile } from "@/types/profile";
import { toast } from "sonner";

interface NewEditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export const NewEditProfileDialog = ({ open, onClose }: NewEditProfileDialogProps) => {
  const { profile: initialProfile, updateProfile } = useProfile();
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
    if (initialProfile && open) {
      setProfile(initialProfile);
    }
  }, [initialProfile, open]);

  // Cleanup effect to remove pointer-events style
  useEffect(() => {
    return () => {
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

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

  const handleClose = () => {
    document.body.style.removeProperty('pointer-events');
    onClose();
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
        handleClose();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent 
        className="max-w-2xl p-6 bg-white"
        onEscapeKeyDown={handleClose}
        onPointerDownOutside={handleClose}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <ProfileForm 
            profile={profile}
            onProfileChange={handleProfileChange}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            type="button"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};