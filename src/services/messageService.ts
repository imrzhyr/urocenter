import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/profile";

export const messageService = {
  async setUserContext(userPhone: string) {
    try {
      console.log('Setting user context for:', userPhone);
      const { error } = await supabase.rpc('set_user_context', { 
        user_phone: userPhone 
      });
      
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
    if (!userPhone) throw new Error('No user phone found');

    // Set user context before fetching messages
    await this.setUserContext(userPhone);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('phone', userPhone)
      .single();

    if (!profile) throw new Error('Profile not found');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
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
    if (!userPhone) throw new Error('No user phone found');

    // Set user context before sending message
    await this.setUserContext(userPhone);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('phone', userPhone)
      .single();

    if (!profile) throw new Error('Profile not found');
    if (isFromDoctor && profile.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can send messages as doctor');
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

    return data as Message;
  }
};