import { toast } from "sonner";

export class CallState {
  private static instance: CallState;
  private isInCall: boolean = false;
  private callStartTime: number | null = null;
  private durationTimer: NodeJS.Timeout | null = null;
  private currentDuration: number = 0;
  private onDurationChange: ((duration: number) => void) | null = null;
  private currentStatus: 'idle' | 'ringing' | 'connected' | 'ended' = 'idle';
  private currentPeerId: string | null = null;

  private constructor() {}

  public static getInstance(): CallState {
    if (!CallState.instance) {
      CallState.instance = new CallState();
    }
    return CallState.instance;
  }

  public startCall(onDurationUpdate: (duration: number) => void) {
    if (this.isInCall) {
      toast.error("Already in a call");
      return;
    }

    this.isInCall = true;
    this.callStartTime = Date.now();
    this.onDurationChange = onDurationUpdate;
    this.currentDuration = 0;

    this.durationTimer = setInterval(() => {
      this.currentDuration += 1;
      if (this.onDurationChange) {
        this.onDurationChange(this.currentDuration);
      }
    }, 1000);

    toast.success("Call started");
  }

  public endCall() {
    if (!this.isInCall) {
      return;
    }

    this.isInCall = false;
    this.callStartTime = null;
    if (this.durationTimer) {
      clearInterval(this.durationTimer);
      this.durationTimer = null;
    }
    this.currentDuration = 0;
    if (this.onDurationChange) {
      this.onDurationChange(0);
    }
    this.onDurationChange = null;
    this.currentStatus = 'ended';
    this.currentPeerId = null;

    toast.info("Call ended");
  }

  public setStatus(status: 'idle' | 'ringing' | 'connected' | 'ended', peerId?: string) {
    this.currentStatus = status;
    if (peerId) {
      this.currentPeerId = peerId;
    }
  }

  public getCallDuration(): number {
    return this.currentDuration;
  }

  public isCallActive(): boolean {
    return this.isInCall;
  }

  public getStatus(): string {
    return this.currentStatus;
  }

  public getPeerId(): string | null {
    return this.currentPeerId;
  }
}

export const callState = CallState.getInstance();