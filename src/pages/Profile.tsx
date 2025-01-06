import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Profile as ProfileType } from "@/hooks/useProfile";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileType>({
    full_name: "",
    gender: "",
    age: "",
    complaint: "",
  });

  const handleFieldChange = (field: keyof ProfileType, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("No phone number found");
        navigate("/signin");
        return;
      }

      // Update the profile in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('phone', userPhone);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        toast.error("Failed to save profile");
        return;
      }

      toast.success("Profile saved successfully!");
      navigate("/payment");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Complete Profile</h1>
            <p className="text-muted-foreground">
              Tell us more about yourself
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfileForm
              profile={profile}
              onProfileChange={handleFieldChange}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!profile.full_name || !profile.gender || !profile.age || !profile.complaint}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;