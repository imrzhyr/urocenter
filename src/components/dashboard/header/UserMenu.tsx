import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useState } from "react";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userPhone');
    navigate("/");
    toast.success(t('logged_out_successfully'));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
          <DropdownMenuItem onClick={() => setShowEditProfile(true)} className="cursor-pointer">
            {t('edit_profile')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProfileDialog 
        open={showEditProfile} 
        onOpenChange={setShowEditProfile}
      />
    </>
  );
};