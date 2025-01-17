import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminStatsCard } from "@/components/dashboard/AdminStatsCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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

  // Sample data for the chart - you can replace this with real data from your backend
  const data = [
    { name: "Jan", patients: 4, messages: 24 },
    { name: "Feb", patients: 8, messages: 35 },
    { name: "Mar", patients: 15, messages: 85 },
    { name: "Apr", patients: 25, messages: 150 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("Back to Dashboard")}
          </Button>
          <h1 className="text-2xl font-bold text-primary dark:text-white">
            {t("Admin Statistics")}
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
              {t("Activity Overview")}
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
    </div>
  );
};

export default AdminStatistics;