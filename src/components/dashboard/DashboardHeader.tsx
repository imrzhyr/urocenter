import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { NotificationsPopover } from "./header/NotificationsPopover";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-50 min-h-[4rem] backdrop-blur-sm dark:bg-[#1A1F2C] dark:border-gray-800">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">
          {t('welcome')}{fullName ? `, ${fullName}` : ''}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsPopover />
        <UserMenu />
      </div>
    </div>
  );
};