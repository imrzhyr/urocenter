import { MessageSquare, Sparkles } from "lucide-react";
import { AdminMessagesList } from "../messages/AdminMessagesList";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AdminMessagesCard = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <motion.div 
      className={cn(
        "w-full",
        "bg-white dark:bg-[#1C1C1E]",
        "rounded-2xl",
        "shadow-sm",
        "border border-[#C6C6C8] dark:border-[#38383A]",
        "overflow-hidden"
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <div className="p-4">
        <div className={cn(
          "flex items-start gap-4",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1
            }}
            className={cn(
              "p-3",
              "bg-[#007AFF]/10 dark:bg-[#0A84FF]/10",
              "rounded-2xl",
              "flex-shrink-0"
            )}
          >
            <MessageSquare className="h-6 w-6 text-[#007AFF] dark:text-[#0A84FF]" />
          </motion.div>

          <div className={cn(
            "flex-1",
            isRTL ? "text-right" : "text-left"
          )}>
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.2
              }}
              className={cn(
                "flex items-center gap-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
            >
              <h2 className={cn(
                "text-[20px]",
                "font-semibold",
                "text-[#1C1C1E] dark:text-white"
              )}>
                {t("Patient Communications")}
              </h2>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="h-5 w-5 text-[#007AFF] dark:text-[#0A84FF]" />
              </motion.div>
            </motion.div>

            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.3
              }}
              className={cn(
                "text-[15px]",
                "text-[#8E8E93] dark:text-[#98989D]",
                "mt-1"
              )}
            >
              {t("Review Patient Inquiries")}
            </motion.p>
          </div>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: 0.4
          }}
          className="w-full mt-4"
        >
          <AdminMessagesList />
        </motion.div>
      </div>
    </motion.div>
  );
}; 