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

export const useMessages = () => {
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
        // First set the user context
        const { error: contextError } = await supabase.rpc('set_user_context', {
          user_phone: userPhone
        });

        if (contextError) {
          console.error('Error setting user context:', contextError);
          toast.error('Error loading messages');
          return;
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', userPhone)
          .maybeSingle();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          setIsLoading(false);
          return;
        }

        console.log('Profile found:', profile);

        // Fetch initial messages
        const { data: initialMessages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          toast.error('Failed to load messages');
          setIsLoading(false);
          return;
        }

        console.log('Initial messages loaded:', initialMessages);
        setMessages(initialMessages || []);

        // Set up real-time subscription
        channel = supabase
          .channel(`messages:${profile.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
              filter: `user_id=eq.${profile.id}`
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
  }, []);

  const addMessage = async (content: string, fileData?: { url: string; name: string; type: string }) => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      toast.error('Please sign in to send messages');
      return false;
    }

    try {
      // Set user context first
      const { error: contextError } = await supabase.rpc('set_user_context', {
        user_phone: userPhone
      });

      if (contextError) {
        console.error('Error setting user context:', contextError);
        toast.error('Error sending message');
        return false;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError || !profile) {
        console.error('Error fetching profile:', profileError);
        toast.error('User profile not found');
        return false;
      }

      console.log('Adding message for profile:', profile);

      // Create optimistic message
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        content,
        is_from_doctor: false,
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type,
      };

      // Add optimistic message to state
      setMessages(prev => [...prev, optimisticMessage]);

      // Create new message object
      const newMessage = {
        content,
        user_id: profile.id,
        is_from_doctor: false,
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_type: fileData?.type,
        created_at: new Date().toISOString()
      };

      // Send message to database
      const { error: insertError } = await supabase
        .from('messages')
        .insert([newMessage]);

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