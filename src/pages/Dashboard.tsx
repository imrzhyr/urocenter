import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

        if (profile?.role === 'admin' && window.location.pathname === '/dashboard') {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#1A1F2C] dark:to-[#2D3748]">
        <LoadingSpinner />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#1A1F2C] dark:to-[#2D3748] transition-colors duration-300">
      <DashboardHeader />
      <main className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-200">
              {t("virtual_consultation_welcome")}
            </h1>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <motion.div variants={item} className="transform hover:scale-[1.02] transition-transform duration-300">
              <MessagesCard />
            </motion.div>
            <motion.div variants={item} className="transform hover:scale-[1.02] transition-transform duration-300">
              <MedicalReportsCard />
            </motion.div>
            <motion.div variants={item} className="transform hover:scale-[1.02] transition-transform duration-300">
              <HealthTipsCard />
            </motion.div>
            <motion.div variants={item} className="transform hover:scale-[1.02] transition-transform duration-300">
              <DoctorProfileCard />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;