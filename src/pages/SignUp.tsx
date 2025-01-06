import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { SignUpHeader } from "@/components/signup/SignUpHeader";
import { ProgressSteps } from "@/components/ProgressSteps";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const steps = ["Sign Up", "Profile", "Medical Info", "Payment"];
  const currentStep = 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SignUpHeader />
      
      <div className="flex-1 container flex flex-col items-center justify-center py-8 space-y-6">
        <ProgressSteps steps={steps} currentStep={currentStep} />
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <PhoneInput value={phone} onChange={setPhone} isSignUp={true} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;