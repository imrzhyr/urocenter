import { io, Socket, Transport } from 'socket.io-client';
import { handleIncomingOffer, handleIncomingAnswer, handleIncomingCandidate } from './handlers';
import { endCall } from './actions';

const socket: Socket = io('https://lovable-signaling.onrender.com', {
  transports: ['websocket', 'polling'] as Transport[],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  forceNew: true,
  autoConnect: true,
  path: '/socket.io/',
  withCredentials: true,
  extraHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
});

socket.on('connect', () => {
  console.log('Connected to signaling server');
});

socket.on('connect_error', (error) => {
  console.error('Signaling server connection error:', error);
  // Attempt to reconnect with polling if websocket fails
  if (socket.io.opts.transports?.includes('websocket')) {
    console.log('Falling back to polling transport');
    socket.io.opts.transports = ['polling'] as Transport[];
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
  if (reason === 'io server disconnect') {
    socket.connect();
  }
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