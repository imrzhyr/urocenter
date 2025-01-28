import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  onClose: () => void;
}

export const LanguageSelector = ({ onClose }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setLanguage(newLang);
    onClose();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-0 inset-x-0 z-50"
      >
        <div className="bg-[#1C1C1E] rounded-t-3xl p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white text-center">
              Select Language
            </h3>
            <p className="text-[#98989D] text-sm text-center">
              Choose your preferred language
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={cn(
                "w-full p-4 rounded-xl flex items-center justify-between",
                "transition-colors duration-200",
                language === 'en'
                  ? "bg-[#0A84FF] text-white"
                  : "bg-[#2C2C2E] text-[#98989D]"
              )}
            >
              <span className="text-[17px]">English</span>
              {language === 'en' && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>
            
            <button
              onClick={() => handleLanguageChange('ar')}
              className={cn(
                "w-full p-4 rounded-xl flex items-center justify-between",
                "transition-colors duration-200",
                language === 'ar'
                  ? "bg-[#0A84FF] text-white"
                  : "bg-[#2C2C2E] text-[#98989D]"
              )}
            >
              <span className="text-[17px]">العربية</span>
              {language === 'ar' && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full p-4 rounded-xl bg-[#2C2C2E] text-[#FF453A] text-[17px] font-medium"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </>
  );
};