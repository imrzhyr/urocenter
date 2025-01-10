import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export const AppointmentCard = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white p-6 rounded-2xl shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t("next_available")}</h2>
          <p className="text-sm text-gray-600">{t("schedule_consultation")}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            <span>{t("today")}</span>
          </div>
          <span className="text-primary font-medium">3:00 PM</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            <span>{t("tomorrow")}</span>
          </div>
          <span className="text-primary font-medium">11:00 AM</span>
        </div>

        <Button className="w-full" variant="outline">
          {t("view_all_slots")}
        </Button>
      </div>
    </motion.div>
  );
};