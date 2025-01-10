import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaymentMethods } from "@/components/PaymentMethods";
import { useLanguage } from "@/contexts/LanguageContext";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900">
            {t("payment")}
          </h1>
          <p className="text-muted-foreground">
            {t("choose_payment_method")}
          </p>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100">
          <h3 className="font-semibold mb-2 text-blue-900">
            {t("consultation_fee")}
          </h3>
          <p className="text-2xl font-bold text-blue-700">
            {t("fee_amount")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-blue-100 p-4">
            <PaymentMethods
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={!paymentMethod}
          >
            {t("complete_payment")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Payment;