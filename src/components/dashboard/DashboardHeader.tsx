import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const DashboardHeader = () => {
  const [fullName, setFullName] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    const fetchProfile = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('phone', userPhone)
          .maybeSingle();

        if (error) throw error;
        if (profile) {
          setFullName(profile.full_name);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "sticky top-0 z-50",
        "px-4 py-3 min-h-[3.5rem]",
        "bg-[#007AFF] dark:bg-[#0A84FF]",
        "backdrop-blur-xl",
        "border-b border-[#0071E3] dark:border-[#0A84FF]/50",
        "shadow-sm"
      )}
    >
      <div className={cn(
        "flex justify-between items-center",
        "max-w-lg mx-auto",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        <motion.div 
          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1
          }}
          className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <h1 className={cn(
            "text-[17px] font-semibold", // iOS body text size
            "text-white",
            "transition-colors duration-200"
          )}>
            {t('welcome')}{fullName ? `, ${fullName}` : ''}
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.2
          }}
          className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <UserMenu />
        </motion.div>
      </div>
    </motion.header>
  );
};