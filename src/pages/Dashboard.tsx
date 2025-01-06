import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, FileText, Settings, 
  LogOut, User, Bell, Plus, Eye
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
  const [medicalReportsCount, setMedicalReportsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
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

        // Fetch medical reports count
        const { count } = await supabase
          .from('medical_reports')
          .select('*', { count: 'exact', head: true });

        setMedicalReportsCount(count || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    navigate("/signin");
    toast.success("Logged out successfully");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">
            Welcome{fullName ? `, ${fullName}` : ''}
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

      {/* Medical Reports Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medical Reports</CardTitle>
            <CardDescription>Manage your medical documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{medicalReportsCount}</div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/medical-records")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate("/profile")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
            <CardDescription>Chat with your doctor</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest medical updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Medical Report Uploaded</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MessageSquare className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Chat with Dr. Ali</p>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;