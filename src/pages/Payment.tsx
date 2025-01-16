import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaymentMethods } from "@/components/PaymentMethods";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const { t } = useLanguage();

  const handlePaymentContinue = async () => {
    if (!paymentMethod) {
      toast.error(t("please_select_payment_method"));
      return;
    }

    setIsProcessing(true);

    try {
      // Call the process-payment edge function
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          amount: 25000,
          payment_method: paymentMethod
        }
      });

      if (error) throw error;

      if (data?.payment_url) {
        // Update profile with payment method before redirecting
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) throw new Error('No user phone found');

        await supabase
          .from('profiles')
          .update({
            payment_method: paymentMethod,
            payment_status: 'processing',
            payment_date: new Date().toISOString()
          })
          .eq('phone', userPhone);

        // Redirect to payment gateway
        window.location.href = data.payment_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(t("payment_error"));
      setIsProcessing(false);
    }
  };

  const handleCompletePayment = async () => {
    if (!isPaid) {
      toast.error("Please complete the payment first");
      return;
    }

    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) throw new Error('No user phone found');

      await supabase
        .from('profiles')
        .update({
          payment_status: 'paid',
        })
        .eq('phone', userPhone);

      toast.success("Payment completed successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing payment:', error);
      toast.error("Failed to complete payment");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900">
            {t("payment_title")}
          </h1>
          <p className="text-muted-foreground">
            {t("choose_payment_method")}
          </p>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100">
          <h3 className="font-semibold mb-2 text-blue-900">{t("consultation_fee_title")}</h3>
          <p className="text-2xl font-bold text-blue-700">25,000 IQD</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-blue-100 p-4">
            <PaymentMethods
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
              onContinuePayment={handlePaymentContinue}
              isPaid={isPaid}
            />
          </div>

          <div className="text-center">
            <p className={cn(
              "font-medium mb-2",
              isPaid ? "text-green-500" : "text-yellow-600"
            )}>
              {isPaid ? "Payment Completed" : "Not Paid Yet"}
            </p>
            <Button 
              onClick={handleCompletePayment}
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={!isPaid || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="w-5 h-5" />
                  {t("processing_payment")}
                </div>
              ) : (
                t("complete_payment")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;