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
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Notification {
  id: string;
  message: string;
  created_at: string;
  type: "message" | "report" | "resolved";
  sender_name?: string;
}

export const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const { profile } = useProfile();
  const { t, language } = useLanguage();

  const fetchNotifications = async () => {
    if (!profile) return;

    try {
      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_from_doctor,
          is_read,
          sender_name,
          is_resolved
        `)
        .eq(profile.role === 'admin' ? 'is_from_doctor' : 'is_from_doctor', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (messagesError) throw messagesError;

      // Fetch medical reports
      const { data: reports, error: reportsError } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (reportsError) throw reportsError;

      // Combine and format notifications with explicit type assignments
      const formattedNotifications: Notification[] = [
        ...messages.map(msg => ({
          id: msg.id,
          message: profile.role === 'admin'
            ? `${msg.sender_name || t('dashboard.notifications.message_from')} ${t('dashboard.notifications.sent_message')}`
            : msg.is_resolved
              ? t('dashboard.notifications.resolved_chat')
              : `Dr. Ali ${t('dashboard.notifications.sent_message')}`,
          created_at: msg.created_at,
          type: msg.is_resolved ? ('resolved' as const) : ('message' as const),
          sender_name: msg.sender_name
        })),
        ...reports.map(report => ({
          id: report.id,
          message: t('dashboard.notifications.new_report'),
          created_at: report.created_at,
          type: 'report' as const
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(formattedNotifications);
      setHasUnread(messages.some(msg => !msg.is_read));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
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
          <h4 className="font-semibold text-sm text-gray-900">
            {t('dashboard.notifications.title')}
          </h4>
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
                    {format(new Date(notification.created_at), 'PPp', {
                      locale: language === 'ar' ? ar : undefined
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-gray-500">
              {t('dashboard.notifications.no_notifications')}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};