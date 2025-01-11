export interface RTCConfiguration {
  iceServers: RTCIceServer[];
}

export interface SignalingMessage {
  type: string;
  data: any;
}

export interface CallParticipant {
  userId: string;
  stream?: MediaStream;
}