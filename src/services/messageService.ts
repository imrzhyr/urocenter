import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/profile";
import { toast } from "sonner";

export const messageService = {
  async setUserContext(userPhone: string) {
    try {
      console.log('Setting user context for:', userPhone);
      const { error } = await supabase.rpc('set_user_context', { user_phone: userPhone });
      if (error) {
        console.error('Error setting user context:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error setting user context:', error);
      throw error;
    }
  },

  async fetchMessages(userId: string): Promise<Message[]> {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      throw new Error('No user phone found');
    }

    console.log('Fetching messages for user:', userId);
    
    // Set user context before any database operation
    await this.setUserContext(userPhone);

    // First verify if the user has access to these messages
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, id')
      .eq('phone', userPhone)
      .single();

    if (profileError) {
      console.error('Error checking user access:', profileError);
      throw profileError;
    }

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Only allow if user is admin or if messages belong to the user
    if (profile.role !== 'admin' && profile.id !== userId) {
      throw new Error('Unauthorized access to messages');
    }

    // Fetch messages after setting context and verifying access
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
      throw error;
    }

    console.log('Fetched messages:', data);
    return data as Message[];
  },

  async sendMessage(
    content: string, 
    userId: string, 
    isFromDoctor: boolean,
    fileInfo?: { url: string; name: string; type: string }
  ): Promise<Message> {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) {
      throw new Error('No user phone found');
    }

    console.log('Sending message for user:', userId);
    
    // Set user context before sending message
    await this.setUserContext(userPhone);

    // First verify if the user has admin role when sending as doctor
    if (isFromDoctor) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('phone', userPhone)
        .single();

      if (profileError) {
        console.error('Error checking user role:', profileError);
        throw profileError;
      }

      if (!profile || profile.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can send messages as doctor');
      }
    }

    const messageData = {
      content: content.trim(),
      user_id: userId,
      is_from_doctor: isFromDoctor,
      status: 'not_seen',
      file_url: fileInfo?.url,
      file_name: fileInfo?.name,
      file_type: fileInfo?.type
    };

    console.log('Message data:', messageData);

    // Insert message after setting context and verifying role
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data as Message;
  }
};