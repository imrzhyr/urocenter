import { io, Socket } from 'socket.io-client';
import { supabase } from '@/integrations/supabase/client';

interface CallState {
  peerConnection: RTCPeerConnection | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCalling: boolean;
  isReceivingCall: boolean;
  callerId: string | null;
  calleeId: string | null;
  callDuration: number;
  isMuted: boolean;
}

let state: CallState = {
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

// Using a free Socket.IO demo server for development
// In production, you should use your own signaling server
const socket: Socket = io('https://lovable-signaling.onrender.com', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const configuration: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

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

  socket.emit('callEnded', {
    to: state.calleeId || state.callerId,
  });
};

// Socket event listeners with improved error handling and logging
socket.on('connect', () => {
  console.log('Connected to signaling server');
});

socket.on('connect_error', (error) => {
  console.error('Signaling server connection error:', error);
});

socket.on('offer', ({ from, offer }) => {
  console.log('Received offer from:', from);
  handleIncomingOffer(from, offer);
});

socket.on('answer', ({ from, answer }) => {
  console.log('Received answer from:', from);
  handleIncomingAnswer(from, answer);
});

socket.on('candidate', ({ from, candidate }) => {
  console.log('Received ICE candidate from:', from);
  handleIncomingCandidate(from, candidate);
});

socket.on('callRejected', () => {
  console.log('Call was rejected');
  endCall();
});

socket.on('callEnded', () => {
  console.log('Call ended by remote peer');
  endCall();
});

export {
  startCall,
  endCall,
  acceptCall,
  rejectCall,
  toggleMute,
};
