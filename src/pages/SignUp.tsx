import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/PhoneInput";
import { ProgressSteps } from "@/components/ProgressSteps";
import { ArrowLeft } from "lucide-react";

const steps = ["Phone", "Verify", "Profile", "Payment"];

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep] = useState(0);
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verify");
  };

  return (
    <div className="min-h-screen flex flex-col bg-accent">
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        <div className="w-full max-w-md space-y-8">
          <ProgressSteps steps={steps} currentStep={currentStep} />

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Enter your phone number to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <PhoneInput value={phone} onChange={setPhone} />
            
            <Button type="submit" className="w-full" disabled={phone.length < 11}>
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;