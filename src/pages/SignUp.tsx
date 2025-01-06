import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ArrowLeft, Globe } from "lucide-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const steps = ["Auth", "Profile", "Payment"];

const SignUp = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [complaint, setComplaint] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setCurrentStep(1);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
          <div className="absolute inset-0 animate-wave">
            <svg className="absolute bottom-0 w-full h-48" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path 
                fill="#0066CC" 
                fillOpacity="0.2" 
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              >
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                         M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,144C960,128,1056,128,1152,144C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </path>
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center relative z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
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

      <div className="flex-1 flex flex-col items-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {steps[currentStep]}
            </h1>
            <p className="text-muted-foreground">
              {currentStep === 0
                ? "Sign in to get started"
                : currentStep === 1
                ? "Complete your profile information"
                : "Choose your payment method"}
            </p>
          </div>

          {currentStep === 0 ? (
            <div className="bg-card p-6 rounded-lg shadow-lg animate-fade-in">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#0066CC',
                        brandAccent: '#004999',
                      },
                    },
                  },
                }}
                providers={['google', 'apple']}
                redirectTo={window.location.origin}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {currentStep === 1 && (
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
              )}
              {currentStep === 2 && (
                <PaymentMethods
                  selectedMethod={selectedMethod}
                  onSelectMethod={setSelectedMethod}
                />
              )}
              <Button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="w-full"
              >
                {currentStep < steps.length - 1 ? "Continue" : "Complete Payment"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;