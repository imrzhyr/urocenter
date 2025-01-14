import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#1A1F2C]">
      <div className="flex flex-col items-center gap-4">
        <motion.div className="relative w-12 h-12">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                "absolute w-full h-full rounded-full border-2 border-primary",
                "dark:border-primary/80"
              )}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{
                scale: [1 - index * 0.2, 1.5 - index * 0.2],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-4 h-4 bg-primary rounded-full dark:bg-primary/80" />
          </motion.div>
        </motion.div>
        {message && (
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
};