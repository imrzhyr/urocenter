import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AdminNavigation } from "@/components/dashboard/admin/AdminNavigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { PaymentApprovalsCard } from "@/components/dashboard/PaymentApprovalsCard";
import { useQuery } from "@tanstack/react-query";

const AdminPayments = () => {
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

  const { data: paymentStats, refetch } = useQuery({
    queryKey: ['paymentStats'],
    queryFn: async () => {
      console.log('Fetching payment stats...');
      const { data, error } = await supabase
        .from('profiles')
        .select('payment_status, payment_date')
        .eq('payment_status', 'paid')
        .eq('payment_approval_status', 'approved')
        .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (error) throw error;
      
      const totalAmount = (data?.length || 0) * 25000;
      const paidUsers = data?.length || 0;
      
      console.log('Payment stats:', { totalAmount, paidUsers });
      return {
        totalAmount,
        paidUsers
      };
    }
  });

  // Subscribe to real-time updates for payment status changes
  useEffect(() => {
    console.log('Setting up real-time subscription for payment updates...');
    const channel = supabase
      .channel('payment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: "payment_status=eq.paid"
        },
        (payload) => {
          console.log('Payment update received:', payload);
          // Refetch payment stats when any payment status changes
          refetch();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up payment updates subscription');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pb-28">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {t("Monthly Revenue")}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t("Total Revenue This Month")}</p>
                <p className="text-2xl font-bold text-primary">{paymentStats?.totalAmount.toLocaleString()} IQD</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t("Paid Users This Month")}</p>
                <p className="text-2xl font-bold text-green-500">{paymentStats?.paidUsers}</p>
              </div>
            </div>
          </Card>
          
          <PaymentApprovalsCard />
        </motion.div>
      </main>
      <AdminNavigation />
    </div>
  );
};

export default AdminPayments;