import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AdminNavigation } from "@/components/dashboard/admin/AdminNavigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <DashboardHeader />
      <main className="h-[calc(100vh-64px)] overflow-y-auto pt-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8 pb-28"
        >
          <MessagesCard />
        </motion.div>
      </main>
      <AdminNavigation />
    </div>
  );
};

export default AdminDashboard;