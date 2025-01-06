import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .single();

        if (error || !profile) {
          console.log("No profile found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking profile:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkProfile();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MessagesCard />
          <MedicalReportsCard />
          <RecentActivityCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;