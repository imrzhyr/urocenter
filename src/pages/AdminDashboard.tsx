import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AdminNavigation } from "@/components/dashboard/admin/AdminNavigation";
import { AdminMessagesCard } from "@/components/dashboard/admin/AdminMessagesCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const profileId = localStorage.getItem('profileId');
      
      if (!profileId) {
        console.log("No profile ID found, redirecting to signin");
        navigate("/signin", { replace: true });
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', profileId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        navigate("/signin", { replace: true });
        return;
      }

      if (!profile || profile.role !== 'admin') {
        console.log("User is not admin, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
        return;
      }

      console.log("Admin access confirmed");
    };

    checkAdminAccess();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <DashboardHeader />
      <main className="h-[calc(100vh-64px)] overflow-y-auto pt-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8 pb-28"
        >
          <AdminMessagesCard />
        </motion.div>
      </main>
      <AdminNavigation />
    </div>
  );
};

export default AdminDashboard;