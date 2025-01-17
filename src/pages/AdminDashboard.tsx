import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { PaymentApprovalsCard } from "@/components/dashboard/PaymentApprovalsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { ChartBar } from "lucide-react";
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
      <main className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary dark:text-white">
            {t("Admin Dashboard")}
          </h1>
          <Button
            onClick={() => navigate("/admin/statistics")}
            className="flex items-center gap-2"
          >
            <ChartBar className="w-4 h-4" />
            {t("View Statistics")}
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <MessagesCard />
          <PaymentApprovalsCard />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;