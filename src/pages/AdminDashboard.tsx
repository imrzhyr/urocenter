import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminStatsCard } from "@/components/dashboard/AdminStatsCard";
import { MessagesCard } from "@/components/dashboard/MessagesCard";

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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-primary mb-6">Admin Dashboard</h1>
        <div className="grid gap-6">
          <AdminStatsCard />
          <MessagesCard />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;