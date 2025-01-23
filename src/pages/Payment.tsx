import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentMethods } from "@/components/PaymentMethods";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { LoadingScreen } from "@/components/LoadingScreen";
import { toast } from "sonner";
import type { Profile } from "@/types/profile";

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile, isLoading, updateProfile } = useProfile();

  if (isLoading) {
    return <LoadingScreen message={t("loading")} />;
  }

  if (!profile) {
    navigate("/signin");
    return null;
  }

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleContinuePayment = async () => {
    try {
      const updateData: Partial<Profile> = {
        payment_method: selectedMethod,
        payment_status: "pending"
      };
      
      await updateProfile(updateData);
      navigate("/payment-verification");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(t("payment_error"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{t("select_payment")}</h1>
        <PaymentMethods
          selectedMethod={selectedMethod}
          onSelectMethod={handlePaymentMethodSelect}
          onContinuePayment={handleContinuePayment}
        />
      </div>
    </div>
  );
};

export default Payment;