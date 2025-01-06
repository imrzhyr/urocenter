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

// Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.error("Auth error:", error);
          navigate("/signin", { replace: true });
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <MedicalReportsCard />
        <MessagesCard />
      </div>

      <div className="p-4">
        <RecentActivityCard />
      </div>
    </div>
  );
};

export default Dashboard;