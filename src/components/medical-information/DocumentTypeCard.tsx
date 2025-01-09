import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DocumentTypeCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  color: string;
  onClick: () => void;
}

export const DocumentTypeCard = ({
  title,
  icon: Icon,
  description,
  color,
  onClick,
}: DocumentTypeCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};