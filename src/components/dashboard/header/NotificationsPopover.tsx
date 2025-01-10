import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

type NotificationType = "message" | "report" | "resolved";

interface Notification {
  id: string;
  message: string;
  created_at: string;
  type: NotificationType;
}

export const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const { profile } = useProfile();
  const { t } = useLanguage();

  const fetchNotifications = async () => {
    if (!profile) return;

    // Fetch messages
    const { data: messages } = await supabase
      .from('messages')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch medical reports
    const { data: reports } = await supabase
      .from('medical_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    const formattedNotifications: Notification[] = [
      ...(messages?.map(msg => ({
        id: msg.id,
        message: profile.role === 'admin' 
          ? `${msg.profiles?.full_name || t('someone')} ${t('sent_message')}`
          : msg.is_resolved 
            ? t('doctor_resolved_chat')
            : `${t('doctor_name')} ${t('sent_message')}`,
        created_at: msg.created_at,
        type: msg.is_resolved ? 'resolved' as const : 'message' as const
      })) || []),
      ...(reports?.map(report => ({
        id: report.id,
        message: t('new_medical_report'),
        created_at: report.created_at,
        type: 'report' as const
      })) || [])
    ];

    setNotifications(formattedNotifications);
    setHasUnread(messages?.some(msg => !msg.is_read) || false);
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5 text-primary" />
          {hasUnread && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-white border shadow-lg" align="end" sideOffset={5}>
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm text-gray-900">{t('notifications')}</h4>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-gray-500">
              {t('no_notifications')}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};