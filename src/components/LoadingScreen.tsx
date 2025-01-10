import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center gap-6 p-8 rounded-lg bg-card shadow-lg"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full" />
          <LoadingSpinner size="lg" />
        </div>
        
        <div className="space-y-2 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-medium text-foreground"
          >
            {message}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            Please wait while we prepare everything for you
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};