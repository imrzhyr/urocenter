import React, { useEffect, useState } from 'react';
import { MessageContainer } from '../MessageContainer';
import { DoctorChatHeader } from '../doctor/DoctorChatHeader';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Message as ProfileMessage } from '@/types/profile';
import { Message as ChatMessage, FileInfo } from '../types/index';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface DoctorChatProps {
  userId: string;
}

export const DoctorChat: React.FC<DoctorChatProps> = ({ userId }) => {
  console.log('[DoctorChat] Initializing with userId:', userId);
  const { profile } = useProfile();
  const { t } = useLanguage();
  const [patientIsTyping, setPatientIsTyping] = useState(false);

  console.log('[DoctorChat] Current doctor profile:', profile);

  // Fetch patient profile
  const { data: patientProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['patient', userId],
    queryFn: async () => {
      console.log('[DoctorChat] Fetching patient profile for userId:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[DoctorChat] Error fetching patient profile:', error);
        throw error;
      }
      console.log('[DoctorChat] Fetched patient profile:', data);
      return data;
    }
  });

  // Fetch messages
  const { data: messages = [], isLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      console.log('[DoctorChat] Fetching messages for userId:', userId);
      // Fetch all messages for this conversation:
      // 1. Messages sent by the patient (user_id = patient's ID and is_from_doctor = false)
      // 2. Messages sent by the doctor (user_id = doctor's ID and is_from_doctor = true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(user_id.eq.${userId},is_from_doctor.eq.false),and(user_id.eq.${profile?.id},is_from_doctor.eq.true)`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[DoctorChat] Error fetching messages:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('[DoctorChat] No messages found in database');
        return [];
      }

      console.log('[DoctorChat] Found', data.length, 'messages:', {
        fromDoctor: data.filter(m => m.is_from_doctor).length,
        fromPatient: data.filter(m => !m.is_from_doctor).length
      });
      
      // Map messages with simpler structure and ensure created_at is string
      const mappedMessages = await Promise.all(data.map(async msg => {
        // Handle file URL if present
        let fileUrl = msg.file_url;
        if (fileUrl && !fileUrl.startsWith('http')) {
          try {
            console.log('[DoctorChat] Converting storage file URL:', fileUrl);
            const { data } = supabase.storage
              .from('messages')
              .getPublicUrl(fileUrl);
            fileUrl = data.publicUrl;
          } catch (error) {
            console.error('[DoctorChat] Error converting file URL:', error);
            fileUrl = null;
          }
        }

        // Ensure created_at is always a string
        const created_at = msg.created_at instanceof Date 
          ? msg.created_at.toISOString()
          : typeof msg.created_at === 'string' 
            ? msg.created_at 
            : new Date().toISOString();

        return {
          id: msg.id,
          content: msg.content,
          sender_id: msg.is_from_doctor ? profile?.id : msg.user_id,
          receiver_id: msg.is_from_doctor ? msg.user_id : profile?.id,
          created_at,
          status: msg.status || 'sent',
          is_from_doctor: msg.is_from_doctor,
          file_url: fileUrl,
          file_type: msg.file_type,
          file_name: msg.file_name,
          duration: msg.duration,
          seen_at: msg.seen_at,
          delivered_at: msg.delivered_at
        };
      }));

      return mappedMessages;
    },
    refetchInterval: 3000,
    staleTime: 2000
  });

  // Add real-time subscription with the same filter
  useEffect(() => {
    console.log('[DoctorChat] Setting up real-time subscription for userId:', userId);
    const filter = `or(and(user_id.eq.${userId},is_from_doctor.eq.false),and(user_id.eq.${profile?.id},is_from_doctor.eq.true))`;
    console.log('[DoctorChat] Using filter:', filter);
    
    const channel = supabase
      .channel(`messages_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter
        },
        (payload) => {
          console.log('[DoctorChat] Received real-time update:', payload);
          refetchMessages();
        }
      )
      .subscribe();

    return () => {
      console.log('[DoctorChat] Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, refetchMessages, profile?.id]);

  // Add real-time subscription for typing status
  useEffect(() => {
    console.log('[DoctorChat] Setting up typing status subscription for userId:', userId);
    const channel = supabase
      .channel(`typing_${userId}`)
      .on(
        'broadcast',
        { event: 'typing' },
        (payload) => {
          console.log('[DoctorChat] Received typing update:', payload);
          // Only show typing if it's from the patient
          if (payload.payload.userId === userId) {
            setPatientIsTyping(true);
            // Clear typing indicator after 2 seconds
            setTimeout(() => setPatientIsTyping(false), 2000);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('[DoctorChat] Cleaning up typing status subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleSendMessage = async (content: string, fileInfo?: FileInfo) => {
    console.log('[DoctorChat] Attempting to send message:', { content, fileInfo });
    try {
      if (!profile?.id) {
        throw new Error('Doctor profile not found');
      }

      // First check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase
        .from('messages')
        .select('status')
        .limit(1);

      if (testError) {
        console.error('[DoctorChat] Connection test error:', testError);
        throw testError;
      }

      // Get the actual status values from a successful message
      const validStatus = testData?.[0]?.status || 'sent';
      console.log('[DoctorChat] Using valid status:', validStatus);

      const newMessage = {
        user_id: profile.id,
        content,
        is_from_doctor: true,
        is_read: false,
        created_at: new Date().toISOString(),
        status: validStatus,
        sender_name: profile.full_name || 'Doctor',
        ...(fileInfo && {
          file_url: fileInfo.url,
          file_type: fileInfo.type,
          file_name: fileInfo.name
        })
      };
      console.log('[DoctorChat] Constructed new message:', newMessage);

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) {
        console.error('[DoctorChat] Error inserting message:', error);
        throw error;
      }
      
      console.log('[DoctorChat] Message sent successfully:', data);
      // Refetch messages after sending
      refetchMessages();
    } catch (error) {
      console.error('[DoctorChat] Error in handleSendMessage:', error);
      // More detailed error message
      if (error.message?.includes('No API key found')) {
        toast.error('Authentication error. Please check Supabase configuration.');
      } else if (error.message?.includes('check constraint')) {
        toast.error('Invalid message status. Please contact support.');
      } else if (error.message?.includes('Doctor profile not found')) {
        toast.error('Please try reloading the page');
      } else {
        toast.error(t('error_sending_message'));
      }
    }
  };

  // Add logging for render phase
  console.log('[DoctorChat] Render phase - messages length:', messages?.length);
  console.log('[DoctorChat] Render phase - isLoading:', isLoading || isLoadingProfile);
  console.log('[DoctorChat] Render phase - patientProfile:', patientProfile);

  return (
    <MessageContainer 
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading || isLoadingProfile}
      otherPersonIsTyping={patientIsTyping}
      header={
        <DoctorChatHeader
          patientId={userId}
          patientName={patientProfile?.full_name || t('loading')}
          patientPhone={patientProfile?.phone}
        />
      }
    />
  );
};

export default DoctorChat; 