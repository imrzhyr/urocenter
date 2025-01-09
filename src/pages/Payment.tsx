import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaymentMethods } from "@/components/PaymentMethods";
import { motion } from "framer-motion";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center p-6"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-blue-900">Payment</h1>
          <p className="text-muted-foreground">
            Choose your preferred payment method
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100">
              <h3 className="font-semibold mb-2 text-blue-900">Consultation Fee</h3>
              <p className="text-2xl font-bold text-blue-700">25,000 IQD</p>
            </div>

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
              Complete Payment
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Payment;