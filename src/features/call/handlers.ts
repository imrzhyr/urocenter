import { configuration } from './types';
import { state } from './state';
import { socket } from './socket';
import { endCall } from './actions';

export const handleIncomingOffer = async (from: string, offer: RTCSessionDescriptionInit) => {
  try {
    state.callerId = from;
    state.isReceivingCall = true;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    state.localStream = stream;

    const peerConnection = new RTCPeerConnection(configuration);
    state.peerConnection = peerConnection;

    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', {
          candidate: event.candidate,
          to: from,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      state.remoteStream = event.streams[0];
      const remoteAudio = document.getElementById('remoteAudio') as HTMLAudioElement;
      if (remoteAudio) {
        remoteAudio.srcObject = event.streams[0];
      }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('answer', {
      answer,
      to: from,
    });
  } catch (error) {
    console.error('Error handling incoming offer:', error);
    endCall();
  }
};

export const handleIncomingAnswer = async (from: string, answer: RTCSessionDescriptionInit) => {
  try {
    if (state.peerConnection) {
      await state.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  } catch (error) {
    console.error('Error handling incoming answer:', error);
    endCall();
  }
};

export const handleIncomingCandidate = async (from: string, candidate: RTCIceCandidateInit) => {
  try {
    if (state.peerConnection) {
      await state.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  } catch (error) {
    console.error('Error handling incoming candidate:', error);
  }
};