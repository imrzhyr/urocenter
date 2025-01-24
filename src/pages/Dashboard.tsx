import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MessagesCard } from "@/components/dashboard/MessagesCard";
import { MedicalReportsCard } from "@/components/dashboard/MedicalReportsCard";
import { DoctorProfileCard } from "@/components/dashboard/DoctorProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";
import { cn } from "@/lib/utils";
import { LiveBackground } from "@/components/ui/LiveBackground";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { t, language } = useLanguage();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const [hasCheckedPayment, setHasCheckedPayment] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const profileId = localStorage.getItem('profileId');
        
        if (!profileId) {
          navigate("/signin", { replace: true });
          return;
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('payment_status, payment_approval_status, role, full_name, gender, age')
          .eq('id', profileId)
          .single();

        if (error || !profileData) {
          navigate("/signin", { replace: true });
          return;
        }

        // Skip payment check for admins
        if (profileData.role === 'admin') {
          setIsInitialLoad(false);
          setHasCheckedPayment(true);
          return;
        }

        // Check if profile is complete
        const isProfileComplete = Boolean(profileData.full_name && profileData.gender && profileData.age);
        if (!isProfileComplete) {
          navigate("/profile", { replace: true });
          return;
        }

        // Check payment status for regular users
        const isPaid = profileData.payment_status === 'paid';
        const isApproved = profileData.payment_approval_status === 'approved';
        const isPending = profileData.payment_approval_status === 'pending';

        if (isPending) {
          navigate("/payment-verification", { replace: true });
          return;
        }

        if (isPaid && isApproved) {
          setIsInitialLoad(false);
          setHasCheckedPayment(true);
          return;
        }

        // If no payment status or not paid/approved, go to payment
        navigate("/payment", { replace: true });
        return;

      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    checkPaymentStatus();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${localStorage.getItem('profileId')}`
        },
        (payload: RealtimePostgresChangesPayload<Profile>) => {
          const updatedProfile = payload.new as Profile;
          
          // Check if profile is complete
          const isProfileComplete = Boolean(
            updatedProfile.full_name && 
            updatedProfile.gender && 
            updatedProfile.age
          );

          if (!isProfileComplete) {
            navigate("/profile", { replace: true });
            return;
          }

          const paymentStatus = updatedProfile.payment_status || 'unpaid';
          const approvalStatus = updatedProfile.payment_approval_status || 'pending';
          
          if (paymentStatus !== 'paid') {
            toast.info(t('payment_required'));
            navigate("/payment", { replace: true });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, t]);

  // Enhanced animations with iOS spring physics
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        type: "spring",
        stiffness: 100,
        damping: 15
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  // Loading state with iOS-style animation
  if (isProfileLoading && isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] dark:bg-[#1C1C1E]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <LoadingSpinner />
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    navigate("/signin", { replace: true });
    return null;
  }

  return (
    <div className={cn(
      "flex flex-col h-screen relative",
      "bg-[#F2F2F7] dark:bg-[#1C1C1E]", // iOS system background colors
      isRTL ? "rtl" : "ltr"
    )}>
      <LiveBackground className="pointer-events-none" />
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto relative">
        <div className="container max-w-lg mx-auto px-4 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1
            }}
            className="text-center mb-6"
          >
            <h1 className={cn(
              "text-[22px] font-semibold", // iOS large title size
              "bg-gradient-to-r from-[#007AFF] to-[#5856D6]", // iOS system gradient
              "bg-clip-text text-transparent",
              "dark:from-[#0A84FF] dark:to-[#5E5CE6]"
            )}>
              {t("virtual_consultation_welcome")}
            </h1>
          </motion.div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <motion.div 
              variants={item} 
              className="transform active:scale-[0.98] transition-transform duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessagesCard className="bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-xl shadow-lg shadow-black/5" />
            </motion.div>
            <motion.div 
              variants={item} 
              className="transform active:scale-[0.98] transition-transform duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <MedicalReportsCard className="bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-xl shadow-lg shadow-black/5" />
            </motion.div>
            <motion.div 
              variants={item} 
              className="transform active:scale-[0.98] transition-transform duration-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <DoctorProfileCard className="bg-white/80 dark:bg-[#2C2C2E]/80 backdrop-blur-xl shadow-lg shadow-black/5" />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;