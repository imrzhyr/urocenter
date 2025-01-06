import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { AdminStatsCard } from "@/components/dashboard/AdminStatsCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        
        if (!userPhone) {
          console.log("No user phone found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', userPhone)
          .maybeSingle();

        if (error || !profile) {
          console.log("No profile found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        setIsAdmin(profile.role === 'admin');
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-sky-50">
      <DashboardHeader />
      <main className="container py-6 space-y-6">
        {isAdmin ? (
          <>
            <AdminStatsCard />
            <div className="grid gap-6 md:grid-cols-2">
              <MessagesCard />
              <RecentActivityCard />
            </div>
          </>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MessagesCard />
            <MedicalReportsCard />
            <RecentActivityCard />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;