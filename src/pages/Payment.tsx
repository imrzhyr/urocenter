import { PaymentMethods } from "@/components/PaymentMethods";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

export const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();

  const handlePaymentContinue = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      if (!profile) throw new Error("No profile found");

      const { error } = await supabase
        .from('profiles')
        .update({
          payment_method: selectedMethod,
          payment_status: 'pending',
          payment_date: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success("Payment method selected successfully");
      navigate("/payment-verification");
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to process payment");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentMethods
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        onContinuePayment={handlePaymentContinue}
      />
    </div>
  );
};