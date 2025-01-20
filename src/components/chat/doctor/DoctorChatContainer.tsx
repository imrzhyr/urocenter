import React from 'react';
import { DoctorChatHeader } from './DoctorChatHeader';
import { MessageContainer } from '../MessageContainer';
import { useChat } from "@/hooks/useChat";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { CallProvider } from '../call/CallProvider';
import { Message } from "@/types/profile";
import { FileInfo } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from '@/components/LoadingScreen';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

export const DoctorChatContainer = () => {
  const { userId } = useParams<{ userId: string }>();
  const { messages, sendMessage, isLoading: isChatLoading, refreshMessages } = useChat(userId);
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Fetch patient profile data with improved caching
  const { data: patientProfile, isLoading: isLoadingPatient, refetch: refetchPatient } = useQuery({
    queryKey: ['patient', userId],
    queryFn: async () => {
      if (!userId) {
        console.error('No patient ID provided');
        toast.error(t('error_no_patient'));
        navigate('/admin');
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          phone,
          gender,
          age,
          complaint,
          created_at,
          updated_at,
          auth_method,
          last_login,
          role,
          payment_status,
          payment_method,
          payment_date,
          payment_approval_status
        `)
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching patient profile:', error);
        toast.error(t('error_loading_patient'));
        navigate('/admin');
        return null;
      }

      if (!data) {
        toast.error(t('error_patient_not_found'));
        navigate('/admin');
        return null;
      }
      
      return data;
    },
    enabled: !!userId && !!profile?.role,
    retry: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000 // Keep data in cache for 5 minutes
  });

  // Set up realtime subscription for profile updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`profile_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        () => {
          refetchPatient();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refetchPatient]);

  const handleSendMessage = async (content: string, fileInfo?: FileInfo, replyTo?: Message) => {
    if (!userId || !profile?.id) {
      toast.error(t('error_send_message'));
      return;
    }

    try {
      await sendMessage(content, fileInfo, replyTo);
      refreshMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('error_send_message'));
    }
  };

  if (isLoadingPatient) {
    return <LoadingScreen message={t('loading_patient')} />;
  }

  if (!patientProfile || !userId) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <CallProvider>
        <MessageContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isChatLoading}
          header={
            <DoctorChatHeader
              patientId={userId}
              patientName={patientProfile.full_name || ''}
              patientPhone={patientProfile.phone}
              onRefresh={refreshMessages}
            />
          }
          userId={profile?.id || ''}
        />
      </CallProvider>
    </div>
  );
};