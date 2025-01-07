import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export const HealthTipsCard = () => {
  const tips = [
    "Stay hydrated: Drink at least 8 glasses of water daily",
    "Regular exercise can help prevent urological issues",
    "Schedule regular check-ups for prostate health",
    "Monitor your urinary habits and report changes",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white p-6 rounded-2xl shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Health Tips</h2>
          <p className="text-sm text-gray-600">From Dr. Ali Kamal</p>
        </div>
      </div>

      <div className="grid gap-4">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="flex items-start gap-3 text-sm"
          >
            <div className="min-w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
              {index + 1}
            </div>
            <p className="text-gray-600">{tip}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};