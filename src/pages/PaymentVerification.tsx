import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const PaymentVerification = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile, refetch } = useProfile();

  useEffect(() => {
    if (!profile) return;

    let hasRedirected = false;

    console.log('Setting up payment verification polling and subscription...');
    
    // Set up polling interval
    const pollingInterval = setInterval(async () => {
      console.log('Polling for payment status...');
      await refetch();
      
      if (!hasRedirected && profile.payment_status === 'paid' && 
          profile.payment_approval_status === 'approved') {
        console.log('Payment approved (via polling), redirecting to dashboard...');
        hasRedirected = true;
        toast.success(t('payment_approved'));
        navigate('/dashboard', { replace: true });
      }
    }, 3000); // Poll every 3 seconds

    // Set up real-time subscription for profile updates
    const channel = supabase
      .channel(`payment_verification_${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profile.id}`,
        },
        async (payload) => {
          console.log('Payment status change received:', payload);
          const updatedProfile = payload.new;
          
          if (!hasRedirected && updatedProfile.payment_status === 'paid' && 
              updatedProfile.payment_approval_status === 'approved') {
            console.log('Payment approved (via subscription), redirecting to dashboard...');
            hasRedirected = true;
            await refetch();
            toast.success(t('payment_approved'));
            navigate('/dashboard', { replace: true });
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Check initial status
    const checkInitialStatus = async () => {
      await refetch();
      
      if (!hasRedirected && profile.payment_status === 'paid' && 
          profile.payment_approval_status === 'approved') {
        console.log('Payment already approved, redirecting to dashboard...');
        hasRedirected = true;
        toast.success(t('payment_approved'));
        navigate('/dashboard', { replace: true });
      }
    };

    checkInitialStatus();

    return () => {
      console.log('Cleaning up payment verification subscription and polling...');
      clearInterval(pollingInterval);
      supabase.removeChannel(channel);
    };
  }, [navigate, profile?.id, refetch, t, profile?.payment_status, profile?.payment_approval_status]);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#1A1F2C] dark:to-[#2D3748]">
      <div className="p-4 flex justify-end items-center gap-2">
        <WhatsAppSupport />
        <LanguageSelector />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center p-6"
      >
        <div className="text-center space-y-8">
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center"
            >
              <LoadingSpinner className="w-12 h-12 text-primary" />
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
            >
              {t("Waiting For Payment Verification")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 max-w-md mx-auto"
            >
              {t("Our Support Team Is Processing Your Payment")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500 dark:text-gray-500"
            >
              {t("You Will Be Redirected Once Payment Is Confirmed")}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerification;