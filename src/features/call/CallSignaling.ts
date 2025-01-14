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

      this.channel = supabase.channel(`call_${peerId}`);

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

      this.channel.on('broadcast', { event: 'call_ended' }, () => {
        logger.info(MODULE_NAME, 'Call ended by peer');
        window.dispatchEvent(new CustomEvent('callEnded'));
      });

      this.channel.on('presence', { event: 'sync' }, () => {
        const status = this.channel.presenceState();
        logger.debug(MODULE_NAME, 'Call channel status:', status);
      });

      this.channel.on('presence', { event: 'join' }, () => {
        logger.debug(MODULE_NAME, 'Peer joined call channel');
      });

      this.channel.on('presence', { event: 'leave' }, () => {
        logger.debug(MODULE_NAME, 'Peer left call channel');
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

  async endCall() {
    try {
      if (!this.channel || !this.peerId) {
        // Instead of throwing an error, just log a warning and return
        logger.warn(MODULE_NAME, 'Attempted to end call when channel not initialized');
        return;
      }

      logger.info(MODULE_NAME, 'Ending call');
      await this.channel.send({
        type: 'broadcast',
        event: 'call_ended',
        payload: { ended: true }  // Add a payload to prevent 422 error
      });

      await this.cleanup();
    } catch (error) {
      logger.error(MODULE_NAME, 'Error ending call', error as Error);
      // Don't throw the error, just log it
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
      // Don't throw the error, just log it
    }
  }
}

export const callSignaling = CallSignaling.getInstance();