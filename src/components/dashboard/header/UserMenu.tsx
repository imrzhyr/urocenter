import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('userPhone');
    navigate("/");
    toast.success(t('logged_out_successfully'));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="w-9 h-9 text-white hover:bg-white/10"
        >
          <User className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border shadow-lg mt-2">
        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};