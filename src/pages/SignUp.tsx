import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ArrowLeft, Globe, Phone, Shield, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PhoneInput } from "@/components/PhoneInput";
import { ProgressSteps } from "@/components/ProgressSteps";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        setCurrentStep(1);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handlePhoneSubmit = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;
      
      toast.success("Verification code sent to your phone!");
      navigate("/verify", { state: { phone } });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
      // Here you would typically handle payment processing
      // For now, we'll just simulate success
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
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-800">
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
            <div className="relative w-[200%] h-48 animate-wave">
              <svg 
                className="absolute bottom-0 w-full h-full" 
                viewBox="0 0 2880 320" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fill="#0066CC" 
                  fillOpacity="0.2" 
                  d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex justify-between items-center relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-muted rounded-full transition-colors"
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

          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-accent animate-fade-in">
            {currentStep === 0 && (
              <div className="space-y-6">
                <PhoneInput value={phone} onChange={setPhone} />
                <Button
                  onClick={handlePhoneSubmit}
                  className="w-full"
                  disabled={phone.length < 11 || loading}
                >
                  {loading ? "Sending code..." : "Continue"}
                </Button>
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