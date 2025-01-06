import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe } from "lucide-react";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ProgressSteps } from "@/components/ProgressSteps";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tl from-sky-50 via-white to-blue-50">
      <div className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-50/50 rounded-full">
          <ArrowLeft className="w-6 h-6 text-blue-600" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        <ProgressSteps steps={steps} currentStep={3} />
        <div className="w-full max-w-md space-y-8 mt-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-blue-900">Payment</h1>
            <p className="text-muted-foreground">
              Choose your preferred payment method
            </p>
          </div>

          <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-blue-100">
            <h3 className="font-semibold mb-2 text-blue-900">Consultation Fee</h3>
            <p className="text-2xl font-bold text-blue-700">25,000 IQD</p>
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
              Complete Payment
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;