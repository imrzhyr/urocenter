import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [complaint, setComplaint] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/payment");
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
              disabled={!fullName || !gender || !age || !complaint}
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