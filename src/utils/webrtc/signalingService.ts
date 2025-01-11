import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SignalingMessage } from "./types";

export class SignalingService {
  constructor(
    private callId: string,
    private userId: string,
    private remoteUserId: string
  ) {}

  async sendSignalingMessage(type: string, data: any) {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('No authenticated session found:', sessionError);
        toast.error('Authentication required for call');
        throw new Error('No authenticated session found');
      }

      console.log('Sending signaling message:', {
        type,
        callId: this.callId,
        senderId: this.userId,
        receiverId: this.remoteUserId
      });

      const { error } = await supabase.from('webrtc_signaling').insert({
        call_id: this.callId,
        sender_id: this.userId,
        receiver_id: this.remoteUserId,
        type,
        data
      });

      if (error) {
        console.error('Error sending signaling message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error sending signaling message:', error);
      throw error;
    }
  }
}