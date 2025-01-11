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
      // First check if we have a valid user phone in localStorage
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        throw new Error('No user phone found');
      }

      // Verify the user exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (profileError || !profile) {
        throw new Error('User profile not found');
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
      console.error('Error in signaling service:', error);
      toast.error('Connection error. Please try again.');
      throw error;
    }
  }
}