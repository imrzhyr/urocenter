import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { PaymentMethods } from "@/components/PaymentMethods";
import { Phone, Shield, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PhoneInput } from "@/components/PhoneInput";
import { ProgressSteps } from "@/components/ProgressSteps";
import { SignUpHeader } from "@/components/signup/SignUpHeader";
import { toast } from "sonner";

const steps = ["Phone", "Profile", "Payment"];

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [complaint, setComplaint] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    setCurrentStep(1);
  };

  const handleProfileSubmit = async () => {
    try {
      setLoading(true);
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("No user found");

      const { error } = await supabase.from('profiles').upsert({
        id: user.data.user.id,
        full_name: fullName,
        phone,
        gender,
        age,
        complaint
      });

      if (error) throw error;
      
      setCurrentStep(2);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Payment processed successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SignUpHeader />

      <div className="flex-1 flex flex-col items-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <ProgressSteps steps={steps} currentStep={currentStep} />

          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              {currentStep === 0 && <Phone className="w-12 h-12 text-primary" />}
              {currentStep === 1 && <Shield className="w-12 h-12 text-primary" />}
              {currentStep === 2 && <CreditCard className="w-12 h-12 text-primary" />}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {steps[currentStep]}
            </h1>
            <p className="text-muted-foreground">
              {currentStep === 0
                ? "Enter your phone number to get started"
                : currentStep === 1
                ? "Tell us about yourself"
                : "Choose your payment method"}
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-accent">
            {currentStep === 0 && (
              <div className="space-y-6">
                <PhoneInput value={phone} onChange={setPhone} isSignUp={true} />
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <ProfileForm
                  fullName={fullName}
                  setFullName={setFullName}
                  gender={gender}
                  setGender={setGender}
                  age={age}
                  setAge={setAge}
                  complaint={complaint}
                  setComplaint={setComplaint}
                />
                <Button
                  onClick={handleProfileSubmit}
                  className="w-full"
                  disabled={!fullName || !gender || !age || !complaint || loading}
                >
                  {loading ? "Saving..." : "Continue"}
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <PaymentMethods
                  selectedMethod={selectedMethod}
                  onSelectMethod={setSelectedMethod}
                />
                <Button
                  onClick={handlePaymentSubmit}
                  className="w-full"
                  disabled={!selectedMethod || loading}
                >
                  {loading ? "Processing..." : "Complete Payment"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;