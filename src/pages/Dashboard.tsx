import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar, MessageSquare, FileText, Globe, Settings, 
  LogOut, User, Bell, Activity, Pill, Clock, Heart 
} from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  const [fullName, setFullName] = useState("");
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the most recent profile since we're not using auth
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("full_name")
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (profiles?.full_name) {
          setFullName(profiles.full_name);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    navigate("/signin");
    toast.success("Logged out successfully");
  };

  // Health Stats Data (example data)
  const healthStats = [
    { title: "Heart Rate", value: "72 bpm", icon: Heart, color: "text-red-500" },
    { title: "Blood Pressure", value: "120/80", icon: Activity, color: "text-blue-500" },
    { title: "Medications", value: "2 Today", icon: Pill, color: "text-green-500" },
    { title: "Next Check-up", value: "3 Days", icon: Clock, color: "text-purple-500" },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">
            Welcome, {fullName || "Patient"}
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

      {/* Health Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {healthStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-all group"
          onClick={() => navigate("/chat")}
        >
          <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span>Chat with Doctor</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-all group"
          onClick={() => toast.info("Appointment booking coming soon!")}
        >
          <Calendar className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span>Book Appointment</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-primary hover:text-primary-foreground transition-all group"
          onClick={() => navigate("/medical-records")}
        >
          <FileText className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span>Medical Records</span>
        </Button>
      </div>

      {/* Next Appointment */}
      <div className="mt-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>Your upcoming consultation</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;