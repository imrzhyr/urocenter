import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/profile";
import { toast } from "sonner";
import { useProfile } from "./useProfile";
import { useNavigate } from "react-router-dom";

export const useChat = (userId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const fetchMessages = async () => {
    if (!userId) {
      console.log('No userId provided to useChat');
      return;
    }
    
    try {
      console.log('Fetching messages for userId:', userId);
      
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          replyTo,
          referenced_message
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      console.log('Fetched messages:', messages);
      setMessages(messages as Message[]);

      // Mark messages as seen if they're from the other party
      const unseenMessages = messages?.filter(m => 
        !m.seen_at && 
        ((profile?.role === 'admin' && !m.is_from_doctor) || 
         (profile?.role !== 'admin' && m.is_from_doctor))
      ) || [];

      if (unseenMessages.length > 0) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ 
            seen_at: new Date().toISOString(),
            status: 'seen',
            delivered_at: new Date().toISOString()
          })
          .in('id', unseenMessages.map(m => m.id));

        if (updateError) {
          console.error('Error marking messages as seen:', updateError);
        }
      }
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast.error("Failed to load messages");
    }
  };

  const sendMessage = async (
    content: string,
    fileInfo?: { url: string; name: string; type: string; duration?: number },
    replyTo?: Message
  ) => {
    if (!userId || !profile?.id) {
      toast.error("Unable to send message");
      return;
    }

    try {
      setIsLoading(true);

      const messageData = {
        content: content.trim(),
        user_id: userId,
        is_from_doctor: profile.role === 'admin',
        status: 'not_seen',
        file_url: fileInfo?.url,
        file_name: fileInfo?.name,
        file_type: fileInfo?.type,
        duration: fileInfo?.duration,
        sender_name: profile.full_name || 'Unknown User',
        referenced_message: replyTo ? {
          id: replyTo.id,
          content: replyTo.content,
          sender_name: replyTo.sender_name,
          file_type: replyTo.file_type
        } : null
      };

      console.log('Sending message:', messageData);

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      await fetchMessages();
      return data as Message;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTypingStatus = async (isTyping: boolean) => {
    if (!userId || !profile?.id) return;

    try {
      const channel = supabase.channel(`typing_${userId}`);
      
      if (isTyping) {
        await channel.track({
          user: profile.full_name || 'Unknown User',
          typing: true
        });
      } else {
        await channel.untrack();
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to message updates and typing indicators
    const messageChannel = supabase
      .channel(`messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('Received real-time update:', payload);
          await fetchMessages();
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = messageChannel.presenceState();
        const typingUsers = Object.values(state)
          .flat()
          .filter((presence: any) => presence.typing)
          .map((presence: any) => presence.user);
        
        // Update messages with typing users
        setMessages(prev => prev.map(msg => ({
          ...msg,
          typing_users: typingUsers
        })));
      })
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions');
      supabase.removeChannel(messageChannel);
    };
  }, [userId, profile?.id, navigate]);

  return {
    messages,
    isLoading,
    sendMessage,
    updateTypingStatus,
    refreshMessages: fetchMessages
  };
};