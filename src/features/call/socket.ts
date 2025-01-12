import { io, Socket } from 'socket.io-client';
import { handleIncomingOffer, handleIncomingAnswer, handleIncomingCandidate } from './handlers';
import { endCall } from './actions';

const socket: Socket = io('https://lovable-signaling.onrender.com', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  forceNew: true,
});

socket.on('connect', () => {
  console.log('Connected to signaling server');
});

socket.on('connect_error', (error) => {
  console.error('Signaling server connection error:', error);
  if (socket.io.opts.transports.includes('websocket')) {
    console.log('Falling back to polling transport');
    socket.io.opts.transports = ['polling'];
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected to signaling server after ${attemptNumber} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Failed to reconnect to signaling server:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from signaling server:', reason);
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

export { socket };