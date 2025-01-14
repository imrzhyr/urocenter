import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

const MODULE_NAME = 'CallSignaling';

class CallSignaling {
  private static instance: CallSignaling;
  private channel: any;
  private peerId: string | null = null;

  private constructor() {}

  static getInstance(): CallSignaling {
    if (!CallSignaling.instance) {
      CallSignaling.instance = new CallSignaling();
    }
    return CallSignaling.instance;
  }

  async initialize(peerId: string) {
    try {
      this.peerId = peerId;
      logger.info(MODULE_NAME, `Initializing call signaling for peer: ${peerId}`);

      if (this.channel) {
        await this.channel.unsubscribe();
      }

      // Create a unique channel name for this call
      this.channel = supabase.channel(`call:${peerId}`);

      this.channel.on('broadcast', { event: 'call_request' }, (payload: any) => {
        logger.debug(MODULE_NAME, 'Received call request', payload);
        window.dispatchEvent(new CustomEvent('incomingCall', { 
          detail: { callerId: payload.payload.callerId }
        }));
      });

      this.channel.on('broadcast', { event: 'call_response' }, (payload: any) => {
        logger.debug(MODULE_NAME, 'Received call response', payload);
        window.dispatchEvent(new CustomEvent('callResponse', { 
          detail: { accepted: payload.payload.accepted }
        }));
      });

      this.channel.on('broadcast', { event: 'webrtc_offer' }, (payload: any) => {
        logger.debug(MODULE_NAME, 'Received WebRTC offer', payload);
        window.dispatchEvent(new CustomEvent('webrtcOffer', { 
          detail: payload.payload
        }));
      });

      this.channel.on('broadcast', { event: 'webrtc_answer' }, (payload: any) => {
        logger.debug(MODULE_NAME, 'Received WebRTC answer', payload);
        window.dispatchEvent(new CustomEvent('webrtcAnswer', { 
          detail: payload.payload
        }));
      });

      this.channel.on('broadcast', { event: 'ice_candidate' }, (payload: any) => {
        logger.debug(MODULE_NAME, 'Received ICE candidate', payload);
        window.dispatchEvent(new CustomEvent('iceCandidate', { 
          detail: payload.payload
        }));
      });

      this.channel.on('broadcast', { event: 'call_ended' }, () => {
        logger.info(MODULE_NAME, 'Call ended by peer');
        window.dispatchEvent(new CustomEvent('callEnded'));
      });

      try {
        await this.channel.subscribe();
        logger.info(MODULE_NAME, 'Successfully subscribed to call channel');
      } catch (error) {
        logger.error(MODULE_NAME, 'Failed to subscribe to call channel', error as Error);
        throw error;
      }
    } catch (error) {
      logger.error(MODULE_NAME, 'Error initializing call signaling', error as Error);
      throw error;
    }
  }

  async sendCallRequest(callerId: string) {
    try {
      if (!this.channel || !this.peerId) {
        throw logger.createError('Call channel not initialized', 'CALL_001', MODULE_NAME);
      }

      logger.info(MODULE_NAME, `Sending call request to peer: ${this.peerId}`);
      await this.channel.send({
        type: 'broadcast',
        event: 'call_request',
        payload: { callerId }
      });
    } catch (error) {
      logger.error(MODULE_NAME, 'Error sending call request', error as Error);
      throw error;
    }
  }

  async sendCallResponse(accepted: boolean) {
    try {
      if (!this.channel || !this.peerId) {
        throw logger.createError('Call channel not initialized', 'CALL_002', MODULE_NAME);
      }

      logger.info(MODULE_NAME, `Sending call response: ${accepted ? 'accepted' : 'rejected'}`);
      await this.channel.send({
        type: 'broadcast',
        event: 'call_response',
        payload: { accepted }
      });
    } catch (error) {
      logger.error(MODULE_NAME, 'Error sending call response', error as Error);
      throw error;
    }
  }

  async sendWebRTCOffer(offer: RTCSessionDescriptionInit) {
    try {
      if (!this.channel) return;
      await this.channel.send({
        type: 'broadcast',
        event: 'webrtc_offer',
        payload: { offer }
      });
    } catch (error) {
      logger.error(MODULE_NAME, 'Error sending WebRTC offer', error as Error);
    }
  }

  async sendWebRTCAnswer(answer: RTCSessionDescriptionInit) {
    try {
      if (!this.channel) return;
      await this.channel.send({
        type: 'broadcast',
        event: 'webrtc_answer',
        payload: { answer }
      });
    } catch (error) {
      logger.error(MODULE_NAME, 'Error sending WebRTC answer', error as Error);
    }
  }

  async sendIceCandidate(candidate: RTCIceCandidateInit) {
    try {
      if (!this.channel) return;
      await this.channel.send({
        type: 'broadcast',
        event: 'ice_candidate',
        payload: { candidate }
      });
    } catch (error) {
      logger.error(MODULE_NAME, 'Error sending ICE candidate', error as Error);
    }
  }

  async endCall() {
    try {
      if (!this.channel || !this.peerId) {
        logger.warn(MODULE_NAME, 'Attempted to end call when channel not initialized');
        return;
      }

      logger.info(MODULE_NAME, 'Ending call');
      await this.channel.send({
        type: 'broadcast',
        event: 'call_ended',
        payload: { ended: true }
      });

      await this.cleanup();
    } catch (error) {
      logger.error(MODULE_NAME, 'Error ending call', error as Error);
      await this.cleanup();
    }
  }

  async cleanup() {
    try {
      if (this.channel) {
        await this.channel.unsubscribe();
        this.channel = null;
      }
      this.peerId = null;
      logger.info(MODULE_NAME, 'Call signaling cleaned up');
    } catch (error) {
      logger.error(MODULE_NAME, 'Error cleaning up call signaling', error as Error);
    }
  }
}

export const callSignaling = CallSignaling.getInstance();