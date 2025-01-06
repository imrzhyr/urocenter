import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Globe, Stethoscope, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

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
    <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 flex justify-between items-center"
      >
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-primary"
        >
          UroCenter
        </motion.h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="animate-fade-in">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="animate-scale-in">
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 text-center"
        >
          <div className="relative inline-block">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png"
              alt="Dr. Ali Kamal"
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary shadow-lg hover:scale-105 transition-transform duration-300"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-2 -right-2 bg-primary text-white px-3 py-0.5 rounded-full text-xs font-medium animate-pulse"
            >
              Available
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Dr. Ali Kamal
            </h1>
            <p className="text-lg text-muted-foreground">
              Urologist Consultant & Surgeon
            </p>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 w-full mt-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ x: index === 0 ? -20 : 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-2 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="w-full mt-6 space-y-3"
        >
          <Button
            className="w-full py-5 bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate("/signup")}
          >
            Start Your Journey
          </Button>
          <p className="text-sm text-muted-foreground text-center animate-fade-in">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-primary hover:underline font-medium transition-colors"
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;