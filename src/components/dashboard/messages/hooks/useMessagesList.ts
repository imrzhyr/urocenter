import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PatientMessage } from "@/types/messages";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

export const useMessagesList = () => {
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useProfile();

  const fetchMessages = async () => {
    if (!profile?.id) {
      console.log('No profile ID found, skipping fetch');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching messages for admin list');
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          status,
          is_read,
          user_id,
          is_from_doctor,
          is_resolved,
          profiles!messages_user_id_fkey (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        return;
      }

      if (!messagesData) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      // Group messages by user and get the latest message for each user
      const userMessages = messagesData.reduce((acc: { [key: string]: PatientMessage }, message: any) => {
        const userId = message.user_id;
        if (userId === profile?.id) {
          return acc;
        }
        
        const userName = message.profiles?.full_name || "Unknown Patient";
        
        if (!acc[userId] || new Date(message.created_at) > new Date(acc[userId].last_message_time)) {
          const unreadCount = messagesData.filter(
            msg => msg.user_id === userId && !msg.is_read && !msg.is_from_doctor
          ).length;

          acc[userId] = {
            id: userId,
            full_name: userName,
            last_message: message.content || "",
            last_message_time: message.created_at,
            status: message.status,
            unread_count: unreadCount,
            is_resolved: message.is_resolved || false
          };
        }
        return acc;
      }, {});

      const formattedMessages = Object.values(userMessages);
      console.log('Formatted messages:', formattedMessages);
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchMessages();

      // Subscribe to message updates
      const channel = supabase
        .channel('messages_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
          },
          () => {
            console.log('Messages updated, refetching...');
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.id]);

  return {
    messages,
    isLoading,
    refetch: fetchMessages
  };
};