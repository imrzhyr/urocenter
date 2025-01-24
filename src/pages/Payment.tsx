import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";

const paymentMethods: { [key: string]: string } = {
  qicard: "Qi Card",
  fastpay: "Fastpay",
  fib: "FIB",
  zaincash: "ZainCash"
};

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("");
  const { t, isRTL } = useLanguage();
  const { profile } = useProfile();

  const handleSupportContact = async () => {
    if (!selectedMethod) return;
    
    try {
      // Only set payment status to pending when user clicks contact support
      const { error } = await supabase
        .from('profiles')
        .update({
          payment_status: 'unpaid',
          payment_approval_status: 'pending',
          payment_method: selectedMethod
        })
        .eq('id', profile?.id);

      if (error) throw error;

      const selectedMethodName = paymentMethods[selectedMethod];
      const message = encodeURIComponent(t("payment_message", { method: selectedMethodName }));
      
      // Open WhatsApp first, then navigate to verification
      window.open(`https://wa.me/9647702428154?text=${message}`, '_blank');
      navigate('/payment-verification', { replace: true });
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error(t("payment_error"));
    }
  };

  return (
    <>
      <div className="px-4 py-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("payment_details")}
          </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary rounded-xl p-6 text-white shadow-lg mt-6"
        >
          <p className="text-sm opacity-90">{t("amount_to_pay")}</p>
          <h2 className="text-3xl font-bold mt-1">25,000 IQD</h2>
          <p className="text-sm opacity-90 mt-1">{t("medical_consultation_fee")}</p>
        </motion.div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">
            {t("select_payment_method")}
          </h3>

          <div className="space-y-3">
            {[
              {
                id: "qicard",
                name: "Qi Card",
                description: t("iraqi_electronic_payment"),
                logo: "/lovable-uploads/2cb98755-7a98-43b1-b259-3e894b6d9bf3.png"
              },
              {
                id: "fastpay",
                name: "Fastpay",
                description: t("fast_digital_payments"),
                logo: "/lovable-uploads/ea4de526-e37e-4348-acf0-c64cf182a493.png"
              },
              {
                id: "fib",
                name: "FIB",
                description: t("first_iraqi_bank"),
                logo: "/lovable-uploads/baf5ed4f-4ba5-4618-8694-5d71249b817a.png"
              },
              {
                id: "zaincash",
                name: "ZainCash",
                description: t("mobile_wallet_zain"),
                logo: "/lovable-uploads/292e06cf-9fcf-475a-9497-a045233f8b4d.png"
              }
            ].map(method => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border cursor-pointer",
                  "transition-all duration-200",
                  "active:scale-[0.98]",
                  selectedMethod === method.id
                    ? "border-[#0A84FF] bg-[#0A84FF]/10"
                    : "border-[#1C1C1E] bg-[#1C1C1E]/50 hover:border-[#0A84FF]/50",
                )}
              >
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="w-8 h-8 object-contain"
                  />
                  <div className={cn("text-left", isRTL && "text-right")}>
                    <h4 className="font-medium text-white">
                      {method.name}
                    </h4>
                    <p className="text-sm text-[#98989D]">
                      {method.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={cn(
                  "w-5 h-5",
                  "text-[#98989D]",
                  selectedMethod === method.id && "text-[#0A84FF]",
                  isRTL && "rotate-180"
                )} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleSupportContact}
            disabled={!selectedMethod}
            className="w-full bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg py-3 px-4 text-[15px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">
              {t("contact_for_payment")}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default Payment;