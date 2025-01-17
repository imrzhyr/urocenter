import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminStatsCard } from "@/components/dashboard/AdminStatsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AdminNavigation } from "@/components/dashboard/admin/AdminNavigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminStatistics = () => {
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

  // More realistic sample data
  const data = [
    { name: "Jan", patients: 12, messages: 45 },
    { name: "Feb", patients: 19, messages: 78 },
    { name: "Mar", patients: 28, messages: 123 },
    { name: "Apr", patients: 35, messages: 189 },
    { name: "May", patients: 42, messages: 234 },
    { name: "Jun", patients: 49, messages: 298 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 pb-28">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary dark:text-white">
            {t("Statistics Overview")}
          </h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <AdminStatsCard />
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              {t("Activity Growth")}
            </h2>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#0066CC"
                    name="New Patients"
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="#4CAF50"
                    name="Messages"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </main>
      <AdminNavigation />
    </div>
  );
};

export default AdminStatistics;