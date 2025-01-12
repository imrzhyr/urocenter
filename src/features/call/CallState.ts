export type CallStatus = 'idle' | 'ringing' | 'connected' | 'ended';

export interface CallState {
  status: CallStatus;
  startTime?: Date;
  duration: number;
  peerId?: string;
}

class CallStateManager {
  private state: CallState = {
    status: 'idle',
    duration: 0
  };
  private timer?: NodeJS.Timer;

  getState() {
    return { ...this.state };
  }

  setStatus(status: CallStatus, peerId?: string) {
    this.state.status = status;
    if (peerId) this.state.peerId = peerId;
    
    if (status === 'connected' && !this.state.startTime) {
      this.state.startTime = new Date();
      this.startTimer();
    } else if (status === 'ended') {
      this.stopTimer();
      this.state = {
        status: 'idle',
        duration: 0
      };
    }
  }

  private startTimer() {
    this.timer = setInterval(() => {
      if (this.state.startTime) {
        this.state.duration = Math.floor(
          (new Date().getTime() - this.state.startTime.getTime()) / 1000
        );
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}

export const callState = new CallStateManager();