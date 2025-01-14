import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./UserMenu";
import { NotificationsPopover } from "./NotificationsPopover";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";

export const DashboardHeader = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();

  return (
    <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-50 min-h-[4rem] backdrop-blur-sm dark:bg-[#1A1F2C] dark:border-gray-800">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">
          {t('welcome')}{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <NotificationsPopover />
        <UserMenu />
      </div>
    </div>
  );
};