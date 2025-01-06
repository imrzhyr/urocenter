import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  content: string;
  is_from_doctor: boolean;
  file_url?: string;
  file_name?: string;
  file_type?: string;
}

export const useMessages = (patientId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel;
    
    const initializeMessages = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        console.error('No user phone found');
        setIsLoading(false);
        return;
      }

      try {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('phone', userPhone)
          .maybeSingle();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          setIsLoading(false);
          return;
        }

        // Construct the query based on the user's role and patientId
        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (profile.role === 'admin' && patientId) {
          // Admin viewing specific patient's messages
          query = query.eq('user_id', patientId);
        } else if (profile.role === 'patient') {
          // Patient viewing their own messages
          query = query.eq('user_id', profile.id);
        }

        const { data: initialMessages, error: messagesError } = await query;

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          toast.error('Failed to load messages');
          setIsLoading(false);
          return;
        }

        console.log('Initial messages loaded:', initialMessages);
        setMessages(initialMessages || []);

        // Set up real-time subscription
        const channelId = patientId || profile.id;
        channel = supabase
          .channel(`messages:${channelId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
              filter: `user_id=eq.${channelId}`
            },
            (payload) => {
              console.log('Real-time update received:', payload);
              
              if (payload.eventType === 'INSERT') {
                setMessages((prev) => [...prev, payload.new as Message]);
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
          });

      } catch (error) {
        console.error('Error in useMessages:', error);
        toast.error('Error loading messages');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMessages();

    return () => {
      if (channel) {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      }
    };
  }, [patientId]);

  const addMessage = async (content: string, fileData?: { url: string; name: string; type: string }) => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      toast.error('Please sign in to send messages');
      return false;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('phone', userPhone)
        .maybeSingle();

      if (!profile) {
        toast.error('User profile not found');
        return false;
      }

      // Create new message object
      const newMessage = {
        content,
        user_id: patientId || profile.id,
        is_from_doctor: profile.role === 'admin',
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type,
        created_at: new Date().toISOString()
      };

      // Optimistically add message to state
      const optimisticMessage = { ...newMessage, id: crypto.randomUUID() };
      setMessages(prev => [...prev, optimisticMessage]);

      // Send message to database
      const { error: insertError, data: insertedMessage } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (insertError) {
        console.error('Error sending message:', insertError);
        // Remove optimistic message if there was an error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        toast.error('Failed to send message');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  return { messages, isLoading, addMessage };
};