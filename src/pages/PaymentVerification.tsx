import { useEffect, useState } from "react";
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
import { useProfileState } from "@/hooks/useProfileState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const PaymentVerification = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { profile, setState } = useProfileState();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('userPhone');
    navigate('/', { replace: true });
  };

  // Shared function to check profile data
  const checkProfileData = async () => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      navigate('/', { replace: true });
      return null;
    }

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('phone', userPhone)
      .single();

    if (error) throw error;
    if (!profileData) {
      navigate('/', { replace: true });
      return null;
    }

    return profileData;
  };

  // Initial check with delay
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const profileData = await checkProfileData();
        if (!profileData) return;

        setState({ profile: profileData });

        // If not pending, redirect appropriately
        if (profileData.payment_approval_status !== 'pending') {
          if (profileData.payment_status === 'paid' && profileData.payment_approval_status === 'approved') {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/payment', { replace: true });
          }
        }
      } catch (error) {
        console.error('Error checking initial status:', error);
        // Only show error toast for non-network errors
        if (!error.message?.includes('Failed to fetch')) {
          toast.error(t('error_checking_status'));
        }
      }
    }, 1000); // 1 second delay before initial check

    return () => clearTimeout(timer);
  }, [navigate, setState, t]);

  // Polling effect
  useEffect(() => {
    let isSubscribed = true;

    const checkPaymentStatus = async () => {
      try {
        const profileData = await checkProfileData();
        if (!profileData || !isSubscribed) return;

        setState({ profile: profileData });
        console.log('Latest profile data:', profileData);

        const isPaid = profileData.payment_status === 'paid';
        const isApproved = profileData.payment_approval_status === 'approved';
        
        console.log('Payment verification:', { isPaid, isApproved });

        if (isPaid && isApproved) {
          console.log('Payment approved, redirecting to dashboard');
          toast.success(t('payment_approved'));
          navigate('/dashboard', { replace: true });
        } else if (profileData.payment_approval_status !== 'pending') {
          // If no longer pending (e.g. rejected), go back to payment
          navigate('/payment', { replace: true });
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Only show error toast for non-network errors
        if (!error.message?.includes('Failed to fetch')) {
          toast.error(t('error_checking_status'));
        }
      }
    };

    // Set up polling interval
    const pollingInterval = setInterval(checkPaymentStatus, 3000);

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
        async (payload) => {
          console.log('Profile update received:', payload);
          if (isSubscribed) {
            await checkPaymentStatus();
          }
        }
      )
      .subscribe();

    return () => {
      isSubscribed = false;
      clearInterval(pollingInterval);
      supabase.removeChannel(channel);
    };
  }, [navigate, t, setState]);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#1A1F2C] dark:to-[#2D3748]">
      {/* Header with perfectly centered help button */}
      <header className="p-4 flex items-center border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="w-[72px]">
          <LanguageSelector />
        </div>
        <div className="flex-1 flex justify-center">
          <WhatsAppSupport />
        </div>
        <div className="w-[72px]" /> {/* Matching spacer */}
      </header>

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

          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[22px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight"
            >
              {t("waiting_for_payment")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-[17px] leading-relaxed text-gray-600 dark:text-gray-400 max-w-md mx-auto"
            >
              {t("support_processing")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-500"
            >
              {t("redirect_confirmation")}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* iOS-style Sign Out Button */}
      <div className="p-6 flex justify-center">
        <Button
          variant="ghost"
          onClick={() => setShowLogoutDialog(true)}
          className={cn(
            "text-[17px] font-medium text-red-600 dark:text-red-400",
            "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800",
            "rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
            "h-[44px] px-6 min-w-[120px]"
          )}
        >
          {t("sign_out")}
        </Button>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("confirm_logout")}</DialogTitle>
            <DialogDescription>
              {t("logout_warning")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className={cn(
                "w-full h-[44px] text-[17px] font-medium",
                "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              {t("sign_out")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="w-full h-[44px] text-[17px] font-medium"
            >
              {t("cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentVerification;