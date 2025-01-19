import React from 'react';
import { DoctorChatHeader } from './DoctorChatHeader';
import { MessageContainer } from '../MessageContainer';
import { useChat } from "@/hooks/useChat";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";
import { CallProvider } from '../call/CallProvider';
import { Message } from "@/types/profile";
import { FileInfo } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export const DoctorChatContainer = () => {
  const { userId: patientId } = useParams();
  const { messages, sendMessage, isLoading, refreshMessages } = useChat(patientId);
  const { profile } = useProfile();

  // Fetch patient profile data
  const { data: patientProfile, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) {
        console.error('No patient ID provided');
        return null;
      }
      
      console.log('Fetching patient profile for ID:', patientId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();
        
      if (error) {
        console.error('Error fetching patient profile:', error);
        toast.error("Failed to load patient information");
        return null;
      }
      
      console.log('Fetched patient profile:', data);
      return data;
    },
    enabled: !!patientId,
  });

  const handleSendMessage = async (content: string, fileInfo?: FileInfo, replyTo?: Message) => {
    if (!patientId || !profile?.id) {
      toast.error("Unable to send message");
      return;
    }

    try {
      await sendMessage(content, fileInfo, replyTo);
      refreshMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  if (isLoadingPatient) {
    return <div className="flex items-center justify-center h-full">Loading patient information...</div>;
  }

  if (!patientProfile) {
    return <div className="flex items-center justify-center h-full">Patient not found</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <CallProvider>
        <MessageContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          header={
            <DoctorChatHeader
              patientId={patientId}
              patientName={patientProfile.full_name || "Unknown Patient"}
              patientPhone={patientProfile.phone}
              onRefresh={refreshMessages}
            />
          }
          userId={patientId}
        />
      </CallProvider>
    </div>
  );
};