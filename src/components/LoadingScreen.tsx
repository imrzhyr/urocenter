import { motion } from "framer-motion";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-12 h-12">
          <motion.div 
            className="absolute inset-0 border-4 border-primary/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-2 border-4 border-primary rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        {message && (
          <motion.p 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};