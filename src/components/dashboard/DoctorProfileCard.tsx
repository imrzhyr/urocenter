import { motion } from "framer-motion";
import { Calendar, Clock, Award, Star, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const DoctorProfileCard = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const clinicInfo = {
    en: "Sulaymaniyah - Ibrahim Pasha Street - Opposite to Sherko Printing & Advertising - Aran Building - Second Floor - Dr. Ali Kamal",
    ar: "السليمانية- شارع ابراهيم باشا- مقابل مطبعة واعلانات شيركو- عمارة أران- الطابق الثاني- دكتور علي كمال"
  };

  const phoneNumbers = [
    "07729996924",
    "07705449905",
    "07705486036"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#1A1F2C] rounded-2xl p-6 shadow-lg space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto">
          <img
            src="/lovable-uploads/7ac98ca7-e043-4da5-afac-f986ff382bcf.png"
            alt={t("doctor_surgery")}
            className="rounded-full object-cover w-full h-full border-4 border-primary"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("doctor_name")}</h2>
          <p className="text-sm text-primary">{t("doctor_title")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Award className="w-4 h-4 mr-1" />
            </div>
            <p className="text-2xl font-bold text-primary">20+</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">{t("years_experience")}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-primary mb-1">
              <Star className="w-4 h-4 mr-1" />
            </div>
            <p className="text-2xl font-bold text-primary">4.9</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">{t("rating")}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 min-w-[16px] text-primary mr-2" />
              <span>{t("clinic_hours")}</span>
            </div>
            <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 min-w-[16px] text-primary mr-2 mt-1" />
              <a 
                href="https://maps.google.com/?q=35.561398,45.450352"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors text-left"
              >
                {clinicInfo[language === 'ar' ? 'ar' : 'en']}
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4 min-w-[16px] text-primary mr-2" />
                <span>{t("contact_numbers")}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 pl-6">
                {phoneNumbers.map((number) => (
                  <a 
                    key={number}
                    href={`tel:${number}`}
                    className="text-sm hover:text-primary transition-colors flex items-center space-x-2"
                  >
                    <span>{number}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/chat')}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {t("start_consultation")}
        </Button>
      </div>
    </motion.div>
  );
};