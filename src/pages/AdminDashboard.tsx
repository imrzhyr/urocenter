import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { PaymentApprovalsCard } from "@/components/dashboard/PaymentApprovalsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { MessageSquare, CreditCard, BarChart } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pb-20">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
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

      {/* Fixed Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="ghost"
              className="flex-1 flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate("/admin/statistics")}
            >
              <BarChart className="h-5 w-5" />
              <span className="text-sm">{t("Statistics")}</span>
            </Button>
            
            <Button
              className="flex-1 flex flex-col items-center gap-1 h-auto py-2 bg-primary hover:bg-primary/90"
              onClick={() => navigate("/admin")}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">{t("Messages")}</span>
            </Button>
            
            <Button
              variant="ghost"
              className="flex-1 flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate("/admin")}
            >
              <CreditCard className="h-5 w-5" />
              <span className="text-sm">{t("Payments")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;