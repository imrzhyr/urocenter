import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { toast } from "sonner";

interface AdminStats {
  total_patients: number;
  total_messages: number;
  unread_messages: number;
  resolved_chats: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const userPhone = localStorage.getItem('userPhone');
      
      if (!userPhone) {
        toast.error("Please sign in to access the admin dashboard");
        navigate("/signin");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('phone', userPhone)
        .maybeSingle();

      if (error || !profile || profile.role !== 'admin') {
        toast.error("Unauthorized access");
        navigate("/");
        return;
      }

      fetchStats();
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) throw error;
      
      setStats(data[0]);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader title="Admin Dashboard" subtitle="Welcome back, Dr. Ali Kamal" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.total_patients || 0}</p>
          </Card>
          
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Messages</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.total_messages || 0}</p>
          </Card>
          
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Unread Messages</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.unread_messages || 0}</p>
          </Card>
          
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Resolved Chats</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.resolved_chats || 0}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MessagesCard />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;