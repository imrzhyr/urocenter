import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

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
          .select('full_name')
          .eq('phone', userPhone)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          throw error;
        }

        if (profile) {
          setFullName(profile.full_name);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
    
    const checkUnreadMessages = async () => {
      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select('id')
          .eq('is_read', false)
          .eq('is_from_doctor', true)
          .limit(1);

        if (error) throw error;
        setHasUnreadMessages(messages && messages.length > 0);
      } catch (error) {
        console.error("Error checking messages:", error);
      }
    };

    checkUnreadMessages();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('userPhone');
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">
          Welcome{fullName ? `, ${fullName}` : ''}
        </h1>
        <div className="relative">
          <Bell
            className={`w-5 h-5 ${hasUnreadMessages ? 'text-primary' : 'text-muted-foreground'}`}
          />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg">
          <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};