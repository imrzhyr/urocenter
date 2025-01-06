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
    <div className="min-h-screen flex flex-col bg-white">
      <SignUpHeader />
      
      <div className="flex-1 container flex flex-col items-center justify-center py-8 space-y-6">
        <ProgressSteps steps={steps} currentStep={currentStep} />
        
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform -translate-y-12">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl font-semibold text-primary mt-4">Create an account</CardTitle>
            <p className="text-muted-foreground text-sm">
              Sign up to get started with your medical journey
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg p-6">
              <PhoneInput value={phone} onChange={setPhone} isSignUp={true} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2024 All rights reserved
      </footer>
    </div>
  );
};

export default SignUp;