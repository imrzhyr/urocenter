import { motion } from "framer-motion";
import { Droplet } from "lucide-react";

export const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/20 dark:via-[#1A1F2C] dark:to-[#1A1F2C]"
    >
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
          className="relative"
        >
          <Droplet
            className="w-24 h-24 text-primary animate-pulse"
            strokeWidth={1.5}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Droplet className="w-16 h-16 text-primary/30" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-4xl font-bold text-primary tracking-tight"
        >
          UroCenter
        </motion.h1>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center space-x-1"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </motion.div>
      </div>
    </motion.div>
  );
};