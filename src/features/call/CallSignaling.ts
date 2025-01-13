import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { webRTCCall } from "./WebRTCCall";
import { toast } from "sonner";

export class CallSignaling {
  private channel: RealtimeChannel | null = null;
  private peerId: string | null = null;

  initialize(peerId: string) {
    console.log('Initializing call signaling for peer:', peerId);
    this.peerId = peerId;
    this.channel = supabase.channel(`call:${peerId}`);

    this.channel
      .on('broadcast', { event: 'call-request' }, this.handleCallRequest)
      .on('broadcast', { event: 'call-response' }, this.handleCallResponse)
      .on('broadcast', { event: 'call-ended' }, this.handleCallEnded)
      .on('broadcast', { event: 'webrtc-offer' }, this.handleWebRTCOffer)
      .on('broadcast', { event: 'webrtc-answer' }, this.handleWebRTCAnswer)
      .on('broadcast', { event: 'webrtc-ice-candidate' }, this.handleICECandidate)
      .subscribe((status) => {
        console.log('Call channel status:', status);
      });
  }

  private handleCallRequest = async ({ payload }: any) => {
    console.log('Received call request:', payload);
    window.dispatchEvent(new CustomEvent('incomingCall', { detail: payload }));
  };

  private handleCallResponse = async ({ payload }: any) => {
    console.log('Received call response:', payload);
    window.dispatchEvent(new CustomEvent('callResponse', { detail: payload }));
    
    if (payload.accepted) {
      try {
        const offer = await webRTCCall.startCall(this.peerId!);
        await this.sendWebRTCOffer(offer);
      } catch (error) {
        console.error('Error starting WebRTC call:', error);
        toast.error('Failed to establish call connection');
      }
    }
  };

  private handleCallEnded = () => {
    console.log('Call ended');
    window.dispatchEvent(new CustomEvent('callEnded'));
    webRTCCall.endCall();
  };

  private handleWebRTCOffer = async ({ payload }: any) => {
    console.log('Received WebRTC offer:', payload);
    try {
      const answer = await webRTCCall.handleIncomingOffer(payload.offer);
      await this.sendWebRTCAnswer(answer);
    } catch (error) {
      console.error('Error handling WebRTC offer:', error);
      toast.error('Failed to handle incoming call');
    }
  };

  private handleWebRTCAnswer = async ({ payload }: any) => {
    console.log('Received WebRTC answer:', payload);
    try {
      await webRTCCall.handleAnswer(payload.answer);
    } catch (error) {
      console.error('Error handling WebRTC answer:', error);
      toast.error('Failed to establish call connection');
    }
  };

  private handleICECandidate = async ({ payload }: any) => {
    console.log('Received ICE candidate:', payload);
    try {
      await webRTCCall.handleIceCandidate(payload.candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  async sendCallRequest(recipientId: string, callerId: string) {
    console.log('Sending call request to:', recipientId);
    await this.channel?.send({
      type: 'broadcast',
      event: 'call-request',
      payload: { callerId, recipientId, timestamp: new Date().toISOString() }
    });
  }

  async sendCallResponse(accepted: boolean) {
    console.log('Sending call response:', accepted);
    if (!this.peerId) return;
    
    await this.channel?.send({
      type: 'broadcast',
      event: 'call-response',
      payload: { 
        accepted, 
        peerId: this.peerId,
        timestamp: new Date().toISOString() 
      }
    });
  }

  async sendWebRTCOffer(offer: RTCSessionDescriptionInit) {
    console.log('Sending WebRTC offer:', offer);
    await this.channel?.send({
      type: 'broadcast',
      event: 'webrtc-offer',
      payload: { 
        offer,
        timestamp: new Date().toISOString() 
      }
    });
  }

  async sendWebRTCAnswer(answer: RTCSessionDescriptionInit) {
    console.log('Sending WebRTC answer:', answer);
    await this.channel?.send({
      type: 'broadcast',
      event: 'webrtc-answer',
      payload: { 
        answer,
        timestamp: new Date().toISOString() 
      }
    });
  }

  async sendICECandidate(candidate: RTCIceCandidateInit) {
    console.log('Sending ICE candidate:', candidate);
    await this.channel?.send({
      type: 'broadcast',
      event: 'webrtc-ice-candidate',
      payload: { 
        candidate,
        timestamp: new Date().toISOString() 
      }
    });
  }

  async sendCallEnded() {
    console.log('Sending call ended signal');
    await this.channel?.send({
      type: 'broadcast',
      event: 'call-ended',
      payload: { 
        timestamp: new Date().toISOString(),
        reason: 'user_ended' 
      }
    });
  }

  cleanup() {
    console.log('Cleaning up call signaling');
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.peerId = null;
  }
}

export const callSignaling = new CallSignaling();