import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import { LiveBackground } from "@/components/ui/LiveBackground";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Check } from "lucide-react";

export const PaymentVerification = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { profile, setState } = useProfileState();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const isRTL = language === 'ar';
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem('userPhone');
    navigate('/', { replace: true });
  };

  const selectLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    setShowLanguageMenu(false);
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

        // Skip payment verification for admins
        if (profileData.role === 'admin') {
          navigate('/admin', { replace: true });
          return;
        }

        // If no payment method selected or status isn't pending, redirect to payment
        if (!profileData.payment_method || profileData.payment_approval_status !== 'pending') {
          navigate('/payment', { replace: true });
          return;
        }

        // If paid and approved, go to dashboard
        if (profileData.payment_status === 'paid' && profileData.payment_approval_status === 'approved') {
          navigate('/dashboard', { replace: true });
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

        // Skip payment verification for admins
        if (profileData.role === 'admin') {
          navigate('/admin', { replace: true });
          return;
        }

        // If no payment method selected or status isn't pending, redirect to payment
        if (!profileData.payment_method || profileData.payment_approval_status !== 'pending') {
          navigate('/payment', { replace: true });
          return;
        }

        const isPaid = profileData.payment_status === 'paid';
        const isApproved = profileData.payment_approval_status === 'approved';
        
        console.log('Payment verification:', { isPaid, isApproved });

        if (isPaid && isApproved) {
          console.log('Payment approved, redirecting to dashboard');
          toast.success(t('payment_approved'));
          navigate('/dashboard', { replace: true });
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
    <div className="fixed inset-0 w-full h-full flex flex-col bg-[#000B1D] text-white overflow-hidden">
      <LiveBackground className="z-0" />
      
      {/* Header with glass effect */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full bg-[#1C1C1E]/50 backdrop-blur-xl border-b border-white/[0.08]"
      >
        <div className="container max-w-4xl mx-auto p-4 flex items-center">
          <div className="w-[72px]">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-3 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
              >
                <Globe className="w-5 h-5" />
              </button>

              {showLanguageMenu && (
                <div className="fixed inset-0 z-50" onClick={() => setShowLanguageMenu(false)}>
                  <div 
                    className="absolute top-[72px] left-4 bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden min-w-[160px] shadow-xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => selectLanguage('en')}
                      className="w-full px-4 py-3 text-left text-[15px] text-white/90 hover:bg-white/[0.08] flex items-center justify-between"
                    >
                      English
                      {language === 'en' && <Check className="w-4 h-4 text-[#0A84FF]" />}
                    </button>
                    <div className="h-[1px] bg-white/[0.08]" />
                    <button
                      onClick={() => selectLanguage('ar')}
                      className="w-full px-4 py-3 text-right text-[15px] text-white/90 hover:bg-white/[0.08] flex items-center justify-between font-arabic"
                    >
                      العربية
                      {language === 'ar' && <Check className="w-4 h-4 text-[#0A84FF]" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <WhatsAppSupport />
          </div>
          <div className="w-[72px]" />
        </div>
      </motion.header>

      {/* Main content with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-10 flex-1 flex items-center justify-center p-6"
        >
          <div className="text-center space-y-12 max-w-md w-full">
            {/* Animated spinner */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative mx-auto flex justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 rounded-full bg-[#0A84FF]/10 backdrop-blur-xl flex items-center justify-center"
              >
                <LoadingSpinner className="w-16 h-16 text-[#0A84FF]" />
              </motion.div>
            </motion.div>

            {/* Text content with staggered animations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 relative"
            >
              <motion.h2
                className="text-[28px] font-bold bg-gradient-to-r from-[#0055D4] to-[#00A3FF] bg-clip-text text-transparent"
              >
                {t("waiting_for_payment")}
              </motion.h2>
              <motion.p
                className="text-[17px] leading-relaxed text-[#98989D]"
              >
                {t("support_processing")}
              </motion.p>
              <motion.div
                className="text-[15px] leading-relaxed text-[#98989D]/80"
              >
                {t("redirect_confirmation")}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sign Out Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 p-6 flex justify-center"
      >
        <Button
          variant="ghost"
          onClick={() => setShowLogoutDialog(true)}
          className={cn(
            "text-[15px] font-medium text-red-500",
            "bg-[#1C1C1E]/50 backdrop-blur-xl",
            "border border-white/[0.08]",
            "hover:bg-white/[0.08]",
            "rounded-xl h-10 px-4",
            "transition-all duration-200"
          )}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t("sign_out")}
        </Button>
      </motion.div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-semibold">{t("confirm_logout")}</DialogTitle>
            <DialogDescription className="text-[15px] text-[#98989D]">
              {t("logout_warning")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className={cn(
                "w-full h-[44px] text-[15px] font-medium",
                "bg-red-500 hover:bg-red-600",
                "rounded-xl"
              )}
            >
              {t("sign_out")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowLogoutDialog(false)}
              className={cn(
                "w-full h-[44px] text-[15px] font-medium",
                "bg-[#1C1C1E]/50 backdrop-blur-xl",
                "border border-white/[0.08]",
                "hover:bg-white/[0.08]",
                "rounded-xl"
              )}
            >
              {t("cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaymentVerification;