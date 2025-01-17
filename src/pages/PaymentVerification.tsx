import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "@/components/LanguageSelector";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";
import { toast } from "sonner";

export const PaymentVerification = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          console.error('No user phone found');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('payment_status, payment_approval_status')
          .eq('phone', userPhone)
          .single();

        if (error) {
          throw error;
        }

        console.log('Payment status check:', profile);

        if (profile?.payment_status === 'paid' && profile?.payment_approval_status === 'approved') {
          console.log('Payment approved, redirecting to dashboard');
          toast.success(t('payment_approved'));
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    // Initial check
    checkPaymentStatus();

    // Set up polling interval
    const pollingInterval = setInterval(() => {
      console.log('Polling for payment status...');
      checkPaymentStatus();
    }, 3000); // Poll every 3 seconds

    // Set up real-time subscription
    const channel = supabase
      .channel('payment_verification')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `phone=eq.${localStorage.getItem('userPhone')}`
        },
        (payload) => {
          console.log('Profile update received:', payload);
          checkPaymentStatus();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up payment verification subscription and polling...');
      clearInterval(pollingInterval);
      supabase.removeChannel(channel);
    };
  }, [navigate, t]);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#1A1F2C] dark:to-[#2D3748]">
      <div className="p-4 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
            isRTL && "flex-row-reverse"
          )}
        >
          <LogOut className={cn("h-5 w-5", isRTL ? "ml-2" : "mr-2")} />
          {t("sign_out")}
        </Button>
        <div className="flex-1 flex justify-center items-center">
          <WhatsAppSupport />
        </div>
        <LanguageSelector />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex items-center justify-center"
      >
        <div className="text-center space-y-8 p-6">
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
              {t("waiting_for_payment")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 max-w-md mx-auto"
            >
              {t("support_processing")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-gray-500 dark:text-gray-500"
            >
              {t("redirect_confirmation")}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerification;