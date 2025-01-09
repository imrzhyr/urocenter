import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DocumentTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export const DocumentTypeCard = ({
  title,
  description,
  icon: Icon,
  color,
  onClick
}: DocumentTypeCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg ${color} transition-colors cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <Icon className="w-6 h-6" />
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-75">{description}</p>
      </div>
    </motion.div>
  );
};