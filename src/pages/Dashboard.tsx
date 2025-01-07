import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

        if (profile.role === 'admin') {
          navigate("/admin", { replace: true });
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-sky-50">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <MessagesCard />
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <MedicalReportsCard />
            <RecentActivityCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;