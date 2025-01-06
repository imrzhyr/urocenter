import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/PhoneInput";
import { ProgressSteps } from "@/components/ProgressSteps";
import { ProfileForm } from "@/components/ProfileForm";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ArrowLeft, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const steps = ["Phone", "Verify", "Profile", "Payment"];

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [complaint, setComplaint] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <PhoneInput value={phone} onChange={setPhone} />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verification">Verification Code</Label>
              <Input
                id="verification"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
          </div>
        );
      case 2:
        return (
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
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Consultation Fee</h3>
              <p className="text-2xl font-bold">25,000 IQD</p>
            </div>
            <PaymentMethods
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="p-4 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
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
        <div className="w-full max-w-md space-y-8">
          <ProgressSteps steps={steps} currentStep={currentStep} />

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {steps[currentStep]}
            </h1>
            <p className="text-muted-foreground">
              {currentStep === 0
                ? "Enter your phone number to get started"
                : currentStep === 1
                ? "Enter the verification code sent to your phone"
                : currentStep === 2
                ? "Complete your profile information"
                : "Choose your payment method"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            <Button
              type="submit"
              className="w-full"
              disabled={
                (currentStep === 0 && phone.length < 11) ||
                (currentStep === 1 && verificationCode.length < 6) ||
                (currentStep === 2 &&
                  (!fullName || !gender || !age || !complaint)) ||
                (currentStep === 3 && !paymentMethod)
              }
            >
              {currentStep < steps.length - 1 ? "Continue" : "Complete Payment"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;