import { useProfile } from "@/hooks/useProfile";
import { MessageContainer } from "./MessageContainer";
import { PatientChatHeader } from "./patient/PatientChatHeader";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useChat } from "@/hooks/useChat";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const UserChatContainer = () => {
  const { profile } = useProfile();
  const { messages, isLoading, sendMessage } = useChat(profile?.id);
  useAuthRedirect();

  // Add test call functionality
  useEffect(() => {
    if (!profile?.id) return;

    const timer = setTimeout(async () => {
      try {
        // Simulate a call from a test doctor ID
        const { data: adminProfiles, error: adminError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (adminError || !adminProfiles) {
          console.error('No admin found for test call');
          return;
        }

        const { error } = await supabase
          .from('calls')
          .insert({
            caller_id: adminProfiles.id,
            receiver_id: profile.id,
            status: 'pending'
          });

        if (error) {
          console.error('Error creating test call:', error);
          toast.error('Failed to create test call');
        } else {
          console.log('Test call created successfully');
        }
      } catch (error) {
        console.error('Error in test call:', error);
      }
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [profile?.id]);

  const handleSendMessage = async (content: string, fileInfo?: { url: string; name: string; type: string }) => {
    if (!profile?.id) {
      console.error('No profile ID found');
      return;
    }
    await sendMessage(content, fileInfo);
  };

  if (!profile?.id) {
    console.log('No profile ID found, not rendering chat');
    return null;
  }

  return (
    <MessageContainer
      messages={messages}
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      header={<PatientChatHeader />}
      userId={profile.id}
    />
  );
};