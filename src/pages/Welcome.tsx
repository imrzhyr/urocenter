import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe, Stethoscope, Clock, Calendar, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HowItWorks } from "@/components/HowItWorks";
import { motion } from "framer-motion";

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Stethoscope className="w-6 h-6 text-primary" />,
      title: "Expert Care",
      description: "Specialized urological treatments with precision",
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Quick Response",
      description: "24/7 availability for urgent consultations",
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Easy Scheduling",
      description: "Flexible appointment booking system",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: "Direct Communication",
      description: "Direct messaging with Dr. Ali Kamal",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <div className="p-4 flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-primary"
        >
          UroCenter
        </motion.h1>
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
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl space-y-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="relative inline-block">
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png"
                alt="Dr. Ali Kamal"
                className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-primary shadow-lg"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-2 -right-2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium"
              >
                Available
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold tracking-tight text-primary mb-4">
                Dr. Ali Kamal
              </h1>
              <p className="text-2xl text-muted-foreground">
                Urologist Consultant & Surgeon
              </p>
              <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                Welcome to UroCenter, where advanced urological care meets compassionate service. 
                Experience world-class treatment with personalized attention.
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <HowItWorks />

            <div className="space-y-4 pt-8">
              <Button
                className="w-full text-lg py-6 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/signup")}
              >
                Start Your Journey to Better Health
              </Button>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="text-primary hover:underline font-medium transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;