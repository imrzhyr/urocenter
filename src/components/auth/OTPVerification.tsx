import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface OTPVerificationProps {
  phone: string;
  onVerificationComplete: () => void;
  onResendCode: () => void;
}

export const OTPVerification = ({ phone, onVerificationComplete, onResendCode }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6) newOtp[index] = value;
    });
    setOtp(newOtp);
    if (pastedData.length > 0) {
      refs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error(t('invalid_otp'));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otpString,
        type: 'sms'
      });

      if (error) throw error;

      onVerificationComplete();
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(t('invalid_otp'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(60);
    onResendCode();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-white">
          {t('verify_phone')}
        </h2>
        <p className="text-[15px] text-[#98989D]">
          {t('enter_code_sent_to')} {phone}
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            ref={el => refs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "w-12 h-14 text-center text-xl font-semibold",
              "rounded-xl",
              "bg-[#1C1C1E] backdrop-blur-xl",
              "border border-white/[0.08]",
              "text-white",
              "focus:outline-none focus:ring-2 focus:ring-[#0A84FF]",
              "transition-all duration-200",
              digit && "border-[#0A84FF]"
            )}
            whileFocus={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        ))}
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleVerify}
          disabled={otp.join('').length !== 6 || isLoading}
          className={cn(
            "w-full",
            "h-[44px]",
            "text-[17px] font-medium",
            "rounded-xl",
            "shadow-lg",
            "transition-all duration-200",
            "disabled:opacity-50",
            "active:scale-[0.97]",
            otp.join('').length === 6 && !isLoading
              ? "bg-gradient-to-r from-[#0055D4] to-[#00A3FF] hover:opacity-90 text-white"
              : "bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] text-[#98989D] cursor-not-allowed"
          )}
        >
          <span className={cn(
            "flex items-center justify-center gap-2",
            isLoading && "opacity-0"
          )}>
            {t('verify')}
          </span>
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </Button>

        <div className="text-center">
          <AnimatePresence mode="wait">
            {timer > 0 ? (
              <motion.p
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[15px] text-[#98989D]"
              >
                {t('resend_code_in')} {timer}s
              </motion.p>
            ) : (
              <motion.button
                key="resend"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleResend}
                className="text-[15px] text-[#0A84FF] hover:opacity-90 transition-opacity"
              >
                {t('resend_code')}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}; 