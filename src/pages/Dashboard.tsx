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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";
import { AuroraBackground } from "@/components/ui/aurora-background";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [hasCheckedPayment, setHasCheckedPayment] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        
        if (!userPhone) {
          console.log("No user phone found, redirecting to signin");
          navigate("/signin", { replace: true });
          return;
        }

        // Only check payment status once when component mounts
        if (!hasCheckedPayment && profile) {
          console.log("Full profile data:", profile);

          // Ensure payment_status and payment_approval_status have default values
          const paymentStatus = profile.payment_status || 'unpaid';
          const approvalStatus = profile.payment_approval_status || 'pending';

          console.log("Payment status check:", {
            payment_status: paymentStatus,
            payment_approval_status: approvalStatus,
            role: profile.role
          });

          if (profile.role === 'admin') {
            console.log("User is admin, redirecting to admin dashboard");
            navigate("/admin", { replace: true });
            return;
          }

          const isPaid = paymentStatus === 'paid';
          const isApproved = approvalStatus === 'approved';
          
          console.log("Payment verification:", { isPaid, isApproved });

          if (!isPaid || !isApproved) {
            console.log("User not paid or approved, redirecting to payment");
            navigate("/payment", { replace: true });
            return;
          }

          setHasCheckedPayment(true);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/signin", { replace: true });
      }
    };

    checkAuth();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `phone=eq.${localStorage.getItem('userPhone')}`
        },
        (payload: RealtimePostgresChangesPayload<Profile>) => {
          const updatedProfile = payload.new as Profile;
          const paymentStatus = updatedProfile.payment_status || 'unpaid';
          const approvalStatus = updatedProfile.payment_approval_status || 'pending';
          
          if (paymentStatus !== 'paid' || approvalStatus !== 'approved') {
            toast.info(t('payment_approval_pending'));
            navigate("/payment", { replace: true });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, profile, t, hasCheckedPayment]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <AuroraBackground className="min-h-screen">
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
    </AuroraBackground>
  );
};

export default Dashboard;