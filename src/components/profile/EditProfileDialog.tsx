import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import type { Profile } from "@/types/profile";
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditProfileDialog = ({ open, onOpenChange }: EditProfileDialogProps) => {
  const { profile: initialProfile, updateProfile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialProfile || {
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
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your profile information here.
          </DialogDescription>
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