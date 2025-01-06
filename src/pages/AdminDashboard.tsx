import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminStatsCard } from "@/components/dashboard/AdminStatsCard";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const userPhone = localStorage.getItem('userPhone');
      
      if (!userPhone) {
        navigate("/signin", { replace: true });
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('phone', userPhone)
        .maybeSingle();

      if (error || !profile || profile.role !== 'admin') {
        navigate("/dashboard", { replace: true });
      }
    };

    checkAdminAccess();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-sky-50">
      <DashboardHeader />
      <main className="container py-6 space-y-6">
        <AdminStatsCard />
        <div className="grid gap-6 md:grid-cols-2">
          <MessagesCard />
          <RecentActivityCard />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;