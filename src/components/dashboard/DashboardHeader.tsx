import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserMenu } from "./header/UserMenu";
import { NotificationBell } from "./header/NotificationBell";
import { useLanguage } from "@/contexts/LanguageContext";

export const DashboardHeader = () => {
  const [fullName, setFullName] = useState<string | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
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
    
    const checkUnreadMessages = async () => {
      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select('id')
          .eq('is_read', false)
          .eq('is_from_doctor', true)
          .limit(1);

        if (error) throw error;
        setHasUnreadMessages(messages && messages.length > 0);
      } catch (error) {
        console.error("Error checking messages:", error);
      }
    };

    checkUnreadMessages();
  }, []);

  return (
    <div className="p-4 flex justify-between items-center bg-card border-b sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">
          {t('welcome')}{fullName ? `, ${fullName}` : ''}
        </h1>
        <NotificationBell hasUnreadMessages={hasUnreadMessages} />
      </div>
      <UserMenu />
    </div>
  );
};