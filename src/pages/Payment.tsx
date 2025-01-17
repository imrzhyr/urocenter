import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { PaymentLoadingScreen } from "@/components/payment/PaymentLoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isContactingSupport, setIsContactingSupport] = useState(false);
  const { t } = useLanguage();
  const { profile, refetch } = useProfile();
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('payment_status, payment_approval_status')
        .eq('phone', userPhone)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        return;
      }

      if (data.payment_status === 'unpaid' && data.payment_approval_status === 'pending') {
        setIsWaitingForApproval(true);
      }
    };

    checkPaymentStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('payment_status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `phone=eq.${localStorage.getItem('userPhone')}`,
        },
        async (payload: any) => {
          if (payload.new.payment_status === 'paid' && payload.new.payment_approval_status === 'approved') {
            await refetch();
            toast.success(t("Payment Approved - You can now chat with Dr. Ali Kamal"));
            navigate('/dashboard');
          } else if (payload.new.payment_approval_status === 'pending') {
            setIsWaitingForApproval(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate, refetch, t]);

  const handleSupportContact = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          payment_status: 'unpaid',
          payment_approval_status: 'pending'
        })
        .eq('id', profile?.id);

      if (error) throw error;

      setIsContactingSupport(true);
      setIsWaitingForApproval(true);
      const message = encodeURIComponent(
        `Hello, I would like to pay for UroCenter consultation using ${selectedMethod}. Please guide me through the payment process.`
      );
      window.open(`https://wa.me/9647702428154?text=${message}`, '_blank');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error(t("Error updating payment status"));
    }
  };

  // If waiting for approval, show the waiting screen
  if (isWaitingForApproval) {
    return <PaymentLoadingScreen />;
  }

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            {t("Payment Details")}
          </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-sm opacity-90">{t("Amount to Pay")}</p>
          <h2 className="text-3xl font-bold mt-1">25,000 IQD</h2>
          <p className="text-sm opacity-90 mt-1">{t("Medical Consultation Fee")}</p>
        </motion.div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {t("Select Payment Method")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("Choose Your Preferred Payment Method")}
          </p>

          <div className="space-y-3">
            {[
              {
                id: "qicard",
                name: "Qi Card",
                description: t("Iraqi Electronic Payment Card"),
                logo: "/lovable-uploads/2cb98755-7a98-43b1-b259-3e894b6d9bf3.png"
              },
              {
                id: "fastpay",
                name: "Fastpay",
                description: t("Fast Digital Payments"),
                logo: "/lovable-uploads/ea4de526-e37e-4348-acf0-c64cf182a493.png"
              },
              {
                id: "fib",
                name: "FIB",
                description: t("First Iraqi Bank"),
                logo: "/lovable-uploads/baf5ed4f-4ba5-4618-8694-5d71249b817a.png"
              },
              {
                id: "zaincash",
                name: "ZainCash",
                description: t("Mobile Wallet by Zain Iraq"),
                logo: "/lovable-uploads/292e06cf-9fcf-475a-9497-a045233f8b4d.png"
              }
            ].map((method) => (
              <motion.button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-gray-700"
                } hover:border-primary/50 transition-all`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="w-8 h-8 object-contain"
                  />
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {method.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            ))}
          </div>

          <Button
            onClick={handleSupportContact}
            className="w-full mt-6 py-6 text-base font-medium"
            disabled={!selectedMethod}
          >
            {t("Contact Support For Payment")}
          </Button>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
            {t("Our Support Team Is Available 24/7")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;