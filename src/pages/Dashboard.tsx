import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { DoctorProfileCard } from "@/components/dashboard/DoctorProfileCard";
import { HealthTipsCard } from "@/components/dashboard/HealthTipsCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useProfile } from "@/hooks/useProfile";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { profile } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        
        if (!userPhone) {
          navigate("/signin", { replace: true });
          return;
        }

        if (profile?.role === 'admin') {
          navigate("/admin", { replace: true });
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkAuth();
  }, [navigate, profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#1A1F2C]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#1A1F2C]">
      <DashboardHeader />
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-white">
              {t("virtual_consultation_welcome")}
            </h1>
          </motion.div>
          
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-8 space-y-6">
              <MessagesCard />
              <div className="grid gap-6 md:grid-cols-2">
                <MedicalReportsCard />
              </div>
              <HealthTipsCard />
            </div>
            <div className="md:col-span-4">
              <DoctorProfileCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;