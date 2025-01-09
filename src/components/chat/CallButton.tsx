import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface CallButtonProps {
  userId: string;
  className?: string;
}

export const CallButton = ({ userId, className = "" }: CallButtonProps) => {
  const navigate = useNavigate();

  const handleCall = () => {
    navigate(`/call/${userId}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCall}
        className={`hover:bg-primary/10 rounded-full w-12 h-12 ${className}`}
      >
        <Phone className="h-6 w-6 text-primary" />
      </Button>
    </motion.div>
  );
};