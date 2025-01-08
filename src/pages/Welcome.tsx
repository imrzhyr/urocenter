import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Stethoscope, MessageCircle } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";
import { LanguageSelector } from "@/components/LanguageSelector";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Stethoscope className="w-6 h-6 text-primary" />,
      title: "Expert Care",
      description: "Specialized urological treatments",
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-primary" />,
      title: "Direct Communication",
      description: "Connect with Dr. Ali Kamal",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-sky-50">
      <div className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-primary">UroCenter</h1>
        <LanguageSelector />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 max-w-7xl mx-auto w-full">
        <div className="text-center">
          <div className="relative inline-block">
            <img
              src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png"
              alt="Dr. Ali Kamal"
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Dr. Ali Kamal
            </h1>
            <p className="text-lg text-muted-foreground">
              Urologist Consultant & Surgeon
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mt-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100"
            >
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <TestimonialsCarousel />

        <div className="w-full mt-6 space-y-3 max-w-md mx-auto">
          <Button
            className="w-full py-5 bg-primary hover:bg-primary/90 transition-all duration-300"
            onClick={() => navigate("/signup")}
          >
            Start Your Journey
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-primary hover:underline font-medium transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground">
        © 2024 All rights reserved
      </footer>
    </div>
  );
};

export default Welcome;