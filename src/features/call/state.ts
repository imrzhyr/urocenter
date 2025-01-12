import { CallState } from './types';

export let state: CallState = {
  peerConnection: null,
  localStream: null,
  remoteStream: null,
  isCalling: false,
  isReceivingCall: false,
  callerId: null,
  calleeId: null,
  callDuration: 0,
  isMuted: false,
};

export const resetState = () => {
  state = {
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    isCalling: false,
    isReceivingCall: false,
    callerId: null,
    calleeId: null,
    callDuration: 0,
    isMuted: false,
  };
};