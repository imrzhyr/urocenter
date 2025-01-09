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

interface Notification {
  id: string;
  message: string;
  created_at: string;
}

export const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const { profile } = useProfile();

  const fetchNotifications = async () => {
    if (!profile) return;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, profiles(full_name)')
      .eq(profile.role === 'admin' ? 'is_from_doctor' : 'is_from_doctor', false)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    const formattedNotifications = messages.map(msg => ({
      id: msg.id,
      message: profile.role === 'admin' 
        ? `${msg.profiles.full_name} sent you a message`
        : msg.is_resolved 
          ? 'Dr. Ali marked your chat as resolved'
          : 'Dr. Ali sent you a message',
      created_at: msg.created_at
    }));

    setNotifications(formattedNotifications);
    setHasUnread(messages.some(msg => !msg.is_read));
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
          <h4 className="font-semibold text-sm text-gray-900">Notifications</h4>
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
              No new notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};