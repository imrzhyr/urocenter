import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export class CallSignaling {
  private channel: RealtimeChannel | null = null;
  private peerId: string | null = null;

  initialize(peerId: string) {
    this.peerId = peerId;
    this.channel = supabase.channel(`call:${peerId}`);

    this.channel
      .on('broadcast', { event: 'call-request' }, this.handleCallRequest)
      .on('broadcast', { event: 'call-response' }, this.handleCallResponse)
      .on('broadcast', { event: 'call-ended' }, this.handleCallEnded)
      .subscribe();
  }

  private handleCallRequest = ({ payload }: any) => {
    window.dispatchEvent(new CustomEvent('incomingCall', { detail: payload }));
  };

  private handleCallResponse = ({ payload }: any) => {
    window.dispatchEvent(new CustomEvent('callResponse', { detail: payload }));
  };

  private handleCallEnded = () => {
    window.dispatchEvent(new CustomEvent('callEnded'));
  };

  async sendCallRequest(recipientId: string, callerId: string) {
    await this.channel?.send({
      type: 'broadcast',
      event: 'call-request',
      payload: { callerId, recipientId }
    });
  }

  async sendCallResponse(accepted: boolean) {
    if (!this.peerId) return;
    
    await this.channel?.send({
      type: 'broadcast',
      event: 'call-response',
      payload: { accepted, peerId: this.peerId }
    });
  }

  async sendCallEnded() {
    if (!this.peerId) return;
    
    await this.channel?.send({
      type: 'broadcast',
      event: 'call-ended'
    });
  }

  cleanup() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.peerId = null;
  }
}

export const callSignaling = new CallSignaling();