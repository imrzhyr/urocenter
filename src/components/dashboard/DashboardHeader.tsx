import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('phone', userPhone)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile?.full_name) {
        setFullName(profile.full_name);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userPhone');
    navigate("/signin");
    toast.success("Logged out successfully");
  };

  return (
    <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">
          {fullName ? `Welcome, ${fullName}` : 'Welcome'}
        </h1>
        <div className="relative">
          <Bell 
            className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" 
            onClick={() => toast.info("Notifications coming soon!")}
          />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};