import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-accent">
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Dr. Ali Kamal
            </h1>
            <p className="text-xl text-muted-foreground">
              Urologist Consultant & Surgeon
            </p>
          </div>
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <img
              src="/lovable-uploads/4feeb68c-1aca-4f05-bba5-447da732b1c3.png"
              alt="Medical consultation"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Welcome to Online Consultation
            </h2>
            <p className="text-muted-foreground">
              Get professional medical consultation from the comfort of your home
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              className="w-full text-lg py-6"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-primary hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;