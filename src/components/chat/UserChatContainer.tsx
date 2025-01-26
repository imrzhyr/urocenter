import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageContainer } from "./MessageContainer";
import { Message as ProfileMessage, Profile } from "@/types/profile";
import { Message as ChatMessage, FileInfo } from "./types/index";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LoadingScreen } from '@/components/LoadingScreen';
import { CallProvider } from './call/CallProvider';
import { UserChatHeader } from './UserChatHeader';
import { PatientInfoContainer } from './PatientInfoContainer';

// Admin's UUID for the doctor
const DOCTOR_ID = "8d231b24-7163-4390-8361-4edb6f5f69d3";

export const UserChatContainer = ({ userId }: { userId: string }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showDoctorInfo, setShowDoctorInfo] = useState(false);
  const [doctorIsTyping, setDoctorIsTyping] = useState(false);

  // Fetch doctor profile
  const { data: doctorProfile, isLoading: isLoadingDoctor } = useQuery({
    queryKey: ['doctor', DOCTOR_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', DOCTOR_ID)
        .single();

      if (error) {
        console.error('❌ Error loading doctor profile');
        toast.error(t('error_loading_doctor'));
        return null;
      }

      return data;
    },
    enabled: !!DOCTOR_ID,
    retry: false
  });

  // Fetch messages with React Query
  const { data: messages = [], isLoading: isLoadingMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      const prevLength = messages?.length || 0;

      // Query to get both:
      // 1. Messages sent by the patient (user_id = patient's ID and is_from_doctor = false)
      // 2. Messages sent by the doctor (user_id = doctor's ID and is_from_doctor = true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(user_id.eq.${userId},is_from_doctor.eq.false),and(user_id.eq.${DOCTOR_ID},is_from_doctor.eq.true)`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading messages:', error);
        toast.error(t('error_loading_messages'));
        return [];
      }

      if (!data || data.length === 0) {
        console.log('ℹ️ No messages found');
        return [];
      }

      console.log(`✅ Loaded ${data.length} messages:`, {
        fromDoctor: data.filter(m => m.is_from_doctor).length,
        fromPatient: data.filter(m => !m.is_from_doctor).length
      });

      // Map messages with simpler structure
      const mappedMessages = await Promise.all(data.map(async msg => {
        // Handle file URL if present
        let fileUrl = msg.file_url;
        if (fileUrl && !fileUrl.startsWith('http')) {
          try {
            // Only log file processing on initial load
            if (prevLength === 0) console.log('📎 Processing file:', msg.file_name);
            const { data } = supabase.storage
              .from('messages')
              .getPublicUrl(fileUrl);
            fileUrl = data.publicUrl;
            if (prevLength === 0) console.log('✅ File URL ready:', msg.file_name);
          } catch (error) {
            console.error('❌ Error processing file:', msg.file_name);
            fileUrl = null;
          }
        }

        return {
          id: msg.id,
          content: msg.content,
          sender_id: msg.is_from_doctor ? DOCTOR_ID : userId,
          receiver_id: msg.is_from_doctor ? userId : DOCTOR_ID,
          created_at: msg.created_at,
          updated_at: msg.updated_at || msg.created_at,
          status: msg.status || 'sent',
          is_from_doctor: msg.is_from_doctor,
          file_url: fileUrl,
          file_type: msg.file_type,
          file_name: msg.file_name,
          duration: msg.duration,
          seen_at: msg.seen_at,
          delivered_at: msg.delivered_at,
          typing_users: msg.typing_users,
          referenced_message: msg.referenced_message ? {
            id: msg.referenced_message.id,
            content: msg.referenced_message.content,
            sender_name: msg.referenced_message.sender_name,
            file_type: msg.referenced_message.file_type
          } : null,
          type: msg.type || 'message',
          call: msg.call ? {
            ...msg.call,
            is_from_doctor: msg.is_from_doctor,
            status: msg.call.status || 'missed'
          } : undefined
        };
      }));

      return mappedMessages;
    },
    refetchInterval: 3000,
    staleTime: 2000
  });

  // Add real-time subscription with fixed filter
  useEffect(() => {
    // Same filter as the query above
    const filter = `or(and(user_id.eq.${userId},is_from_doctor.eq.false),and(user_id.eq.${DOCTOR_ID},is_from_doctor.eq.true))`;
    console.log('🔄 Setting up message subscription with filter:', filter);

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
        async (payload) => {
          console.log('📨 New message activity:', payload);
          await refetchMessages();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Message subscription active');
        }
      });

    return () => {
      console.log('🔄 Cleaning up message subscription');
      channel.unsubscribe();
    };
  }, [userId, refetchMessages]);

  // Add real-time subscription for typing status
  useEffect(() => {
    console.log('🔵 [UserChat] Setting up typing status subscription');
    const channel = supabase
      .channel(`typing_${DOCTOR_ID}`)
      .on(
        'broadcast',
        { event: 'typing' },
        (payload) => {
          console.log('🔵 [UserChat] Received typing update:', payload);
          // Only show typing if it's from the doctor
          if (payload.payload.userId === DOCTOR_ID) {
            setDoctorIsTyping(true);
            // Clear typing indicator after 2 seconds
            setTimeout(() => setDoctorIsTyping(false), 2000);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔵 [UserChat] Cleaning up typing status subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async (content: string, fileInfo?: FileInfo) => {
    console.log('🟡 [UserChat] Attempting to send message:', {
      content,
      fileInfo,
      userId,
      timestamp: new Date().toISOString()
    });

    try {
      // First check if we can connect to Supabase
      console.log('🔍 [UserChat] Testing Supabase connection before send...');
      const { data: testData, error: testError } = await supabase
        .from('messages')
        .select('status')
        .limit(1);

      if (testError) {
        console.error('❌ [UserChat] Connection test failed:', {
          error: testError,
          timestamp: new Date().toISOString()
        });
        throw testError;
      }

      const validStatus = testData?.[0]?.status || 'sent';
      console.log('✅ [UserChat] Connection test passed, using status:', validStatus);

      const newMessage = {
        user_id: userId,
        content,
        is_from_doctor: false,
        status: validStatus,
        created_at: new Date().toISOString(),
        ...(fileInfo && {
          file_url: fileInfo.url,
          file_type: fileInfo.type,
          file_name: fileInfo.name
        })
      };

      console.log('🔄 [UserChat] Sending new message:', {
        message: newMessage,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select()
        .single();

      if (error) {
        console.error('❌ [UserChat] Error sending message:', {
          error,
          message: newMessage,
          timestamp: new Date().toISOString()
        });
        throw error;
      }

      console.log('✅ [UserChat] Message sent successfully:', {
        sentMessage: data,
        timestamp: new Date().toISOString()
      });
      
      refetchMessages();
    } catch (error) {
      console.error('❌ [UserChat] Send message error:', {
        error,
        content,
        userId,
        timestamp: new Date().toISOString()
      });
      
      if (error.message?.includes('No API key found')) {
        toast.error('Authentication error. Please check Supabase configuration.');
      } else if (error.message?.includes('check constraint')) {
        toast.error('Invalid message status. Please contact support.');
      } else {
        toast.error(t('error_sending_message'));
      }
    }
  };

  // Add logging for render phase
  console.log('🔵 [UserChat] Render phase:', {
    messagesCount: messages?.length,
    isLoading: isLoadingMessages || isLoadingDoctor,
    doctorProfile,
    timestamp: new Date().toISOString()
  });

  if (isLoadingDoctor) {
    console.log('ℹ️ [UserChat] Loading doctor profile...');
    return <LoadingScreen message={t('loading_doctor')} />;
  }

  if (!doctorProfile) {
    console.log('❌ [UserChat] No doctor profile found, rendering null');
    return null;
  }

  return (
    <CallProvider>
      <MessageContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoadingMessages || isLoadingDoctor}
        otherPersonIsTyping={doctorIsTyping}
        header={
          <UserChatHeader
            doctorId={DOCTOR_ID}
            doctorName={doctorProfile?.full_name || t('loading')}
            onRefresh={refetchMessages}
          />
        }
      />
    </CallProvider>
  );
};