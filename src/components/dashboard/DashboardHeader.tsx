import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { NotificationsPopover } from "./header/NotificationsPopover";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export const DashboardHeader = () => {
  const [fullName, setFullName] = useState<string | null>(null);
  const { t } = useLanguage();

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
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 flex justify-between items-center bg-white/80 dark:bg-[#1A1F2C]/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 min-h-[4rem]"
    >
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {t('welcome')}{fullName ? `, ${fullName}` : ''}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsPopover />
        <UserMenu />
      </div>
    </motion.div>
  );
};