import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, FileText, Globe, Settings, LogOut, User, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/signin");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        if (profile?.full_name) {
          setFullName(profile.full_name);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">
            Welcome, {fullName || "Patient"}
          </h1>
          <Bell className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={() => navigate("/chat")}
        >
          <MessageSquare className="w-8 h-8" />
          <span>Chat with Doctor</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={() => toast.info("Appointment booking coming soon!")}
        >
          <Calendar className="w-8 h-8" />
          <span>Book Appointment</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-all"
          onClick={() => navigate("/medical-records")}
        >
          <FileText className="w-8 h-8" />
          <span>Medical Records</span>
        </Button>
      </div>

      {/* Next Appointment */}
      <div className="mt-auto p-4 bg-card border-t">
        <h2 className="font-semibold mb-2">Next Appointment</h2>
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Video Consultation</p>
              <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
            </div>
            <Button 
              size="sm"
              onClick={() => toast.info("Video consultation feature coming soon!")}
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;