import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { Message } from "@/types/profile";
import { MessageList } from "../MessageList";
import { MessageInput } from "../MessageInput";
import { PatientChatHeader } from "./PatientChatHeader";

export const PatientChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile?.phone) return;

    const fetchMessages = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', profile.phone)
        .single();

      if (!profileData?.id) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        return;
      }

      setMessages(data as Message[]);

      // Mark messages as seen
      const unseenMessages = data?.filter(m => !m.seen_at && m.is_from_doctor) || [];
      if (unseenMessages.length > 0) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ 
            seen_at: new Date().toISOString(),
            status: 'seen'
          })
          .in('id', unseenMessages.map(m => m.id));

        if (updateError) {
          console.error('Error marking messages as seen:', updateError);
        }
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
            
            if (newMessage.is_from_doctor) {
              const { error: updateError } = await supabase
                .from('messages')
                .update({ 
                  delivered_at: new Date().toISOString(),
                  status: 'delivered'
                })
                .eq('id', newMessage.id);

              if (updateError) {
                console.error('Error marking message as delivered:', updateError);
              }
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.phone]);

  const sendMessage = async (content: string) => {
    if (!profile?.phone) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', profile.phone)
      .single();

    if (!profileData?.id) {
      toast.error("Could not send message");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('messages')
      .insert({
        content: content.trim(),
        user_id: profileData.id,
        is_from_doctor: false,
        status: 'sent'
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <PatientChatHeader />
      </div>
      <MessageList messages={messages} />
      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};