import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentMethods } from "@/components/PaymentMethods";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import type { Profile } from "@/types/profile";

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { profile, updateProfile } = useProfile();

  const handleContinuePayment = async () => {
    if (!profile) return;

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
    <div>
      <h1>{t("payment")}</h1>
      <PaymentMethods 
        selectedMethod={selectedMethod} 
        onSelectMethod={setSelectedMethod}
        onContinuePayment={handleContinuePayment}
      />
    </div>
  );
};

export default Payment;