import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaymentMethods } from "@/components/PaymentMethods";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { WhatsAppSupport } from "@/components/WhatsAppSupport";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("");
  const { t } = useLanguage();

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleSupportContact = () => {
    const message = encodeURIComponent(
      `Hello, I would like to pay for UroCenter consultation using ${selectedMethod}. Please guide me through the payment process.`
    );
    window.open(`https://wa.me/9647702428154?text=${message}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900 dark:text-blue-100">
            {t("payment_title")}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            {t("choose_payment_method")}
          </p>
        </div>

        <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-blue-100 dark:border-gray-700">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            {t("consultation_fee_title")}
          </h3>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            25,000 IQD
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-blue-100 dark:border-gray-700 p-4">
            <PaymentMethods
              selectedMethod={selectedMethod}
              onSelectMethod={handlePaymentMethodSelect}
              onContinuePayment={handleSupportContact}
            />
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("contact_support_for_payment")}
            </p>
            <WhatsAppSupport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;