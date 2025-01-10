import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { DoctorProfileCard } from "@/components/dashboard/DoctorProfileCard";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { HealthTipsCard } from "@/components/dashboard/HealthTipsCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        
        if (!userPhone) {
          console.log("No user phone found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', userPhone)
          .maybeSingle();

        if (error || !profile) {
          console.log("No profile found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        if (profile.role === 'admin') {
          navigate("/admin", { replace: true });
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking profile:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#1A1F2C]">
        <div className="animate-pulse text-primary">{t("loading")}</div>
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
                <AppointmentCard />
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
