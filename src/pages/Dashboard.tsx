import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No session found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/signin", { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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