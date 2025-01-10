import { motion } from "framer-motion";

interface CallAvatarProps {
  name: string;
  isRinging: boolean;
}

export const CallAvatar = ({ name, isRinging }: CallAvatarProps) => {
  return (
    <motion.div 
      animate={{ 
        scale: isRinging ? [1, 1.1, 1] : 1 
      }}
      transition={{ 
        repeat: isRinging ? Infinity : 0,
        duration: 1.5 
      }}
      className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
    >
      <span className="text-3xl font-bold text-primary">
        {name?.[0]?.toUpperCase() || '?'}
      </span>
    </motion.div>
  );
};