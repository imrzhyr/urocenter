import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
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
      className="p-4 flex justify-between items-center bg-primary/95 dark:bg-primary/80 backdrop-blur-lg border-b border-primary/10 dark:border-primary/20 sticky top-0 z-50 min-h-[4rem] shadow-sm"
    >
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-white">
          {t('welcome')}{fullName ? `, ${fullName}` : ''}
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <UserMenu />
      </div>
    </motion.div>
  );
};