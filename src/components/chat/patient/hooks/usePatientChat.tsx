import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Message } from "@/types/profile";
import { FileInfo } from "@/types/chat";

// Admin's UUID for the doctor
const DOCTOR_ID = "8d231b24-7163-4390-8361-4edb6f5f69d3";

export const usePatientChat = (userPhone?: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userPhone) return;

    const fetchMessages = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (!profileData?.id) return;

      // Fetch messages where either:
      // 1. user_id is the patient's ID and is_from_doctor is false (patient's messages)
      // 2. user_id is the doctor's ID and is_from_doctor is true (doctor's messages)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(user_id.eq.${profileData.id},is_from_doctor.eq.false),and(user_id.eq.${DOCTOR_ID},is_from_doctor.eq.true)`)
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
          table: 'messages',
          filter: `or(user_id.eq.${DOCTOR_ID},user_id.eq.${profileData?.id})`
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
  }, [userPhone]);

  const sendMessage = async (content: string, fileInfo?: FileInfo) => {
    if (!userPhone) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', userPhone)
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
        status: 'sent',
        file_url: fileInfo?.url,
        file_name: fileInfo?.name,
        file_type: fileInfo?.type,
        duration: fileInfo?.duration
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    } else {
      toast.success("Message sent");
    }
    setIsLoading(false);
  };

  return { messages, isLoading, sendMessage };
};