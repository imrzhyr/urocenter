import { ClipboardList, CreditCard, MessageCircle, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: "Fill Information",
      description: "Complete your medical profile",
    },
    {
      icon: CreditCard,
      title: "Make Payment",
      description: "Multiple payment options",
    },
    {
      icon: MessageCircle,
      title: "Consult Doctor",
      description: "Chat, call, or video consult",
    },
    {
      icon: UserCircle2,
      title: "Follow Up",
      description: "Get continuous care",
    },
  ];

  return (
    <div className="py-4">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-4"
      >
        How It Works
      </motion.h2>
      <div className="grid grid-cols-2 gap-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-3 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2"
            >
              <step.icon className="w-5 h-5 text-primary" />
            </motion.div>
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="text-xs text-muted-foreground text-center">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};