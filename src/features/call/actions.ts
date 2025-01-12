import { state, resetState } from './state';
import { configuration } from './types';
import { socket } from './socket';

export const startCall = async (calleeId: string) => {
  try {
    state.calleeId = calleeId;
    state.isCalling = true;

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
          to: calleeId,
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

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('offer', {
      offer,
      to: calleeId,
    });
  } catch (error) {
    console.error('Error starting call:', error);
    endCall();
  }
};

export const acceptCall = async () => {
  if (state.isReceivingCall && state.callerId) {
    state.isReceivingCall = false;
    socket.emit('callAccepted', { to: state.callerId });
  }
};

export const rejectCall = () => {
  if (state.isReceivingCall && state.callerId) {
    socket.emit('callRejected', { to: state.callerId });
    endCall();
  }
};

export const toggleMute = () => {
  if (state.localStream) {
    state.isMuted = !state.isMuted;
    state.localStream.getAudioTracks().forEach(track => {
      track.enabled = !state.isMuted;
    });
  }
};

export const endCall = () => {
  if (state.peerConnection) {
    state.peerConnection.close();
  }
  if (state.localStream) {
    state.localStream.getTracks().forEach(track => track.stop());
  }
  if (state.remoteStream) {
    state.remoteStream.getTracks().forEach(track => track.stop());
  }

  socket.emit('callEnded', {
    to: state.calleeId || state.callerId,
  });
  
  resetState();
};