import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const EditProfileForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [complaint, setComplaint] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        navigate("/signin");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', userPhone)
          .maybeSingle();

        if (error) throw error;

        if (profile) {
          setFullName(profile.full_name || "");
          setGender(profile.gender || "");
          setAge(profile.age || "");
          setComplaint(profile.complaint || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error("No user phone found");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          gender,
          age,
          complaint,
          updated_at: new Date().toISOString(),
        })
        .eq('phone', userPhone);

      if (error) throw error;

      toast.success("Profile updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
            <h1 className="text-2xl font-semibold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your profile information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProfileForm
              fullName={fullName}
              setFullName={setFullName}
              gender={gender}
              setGender={setGender}
              age={age}
              setAge={setAge}
              complaint={complaint}
              setComplaint={setComplaint}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!fullName || !gender || !age || !complaint || isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};