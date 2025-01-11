import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CallingUser, CallStatus } from "@/types/call";

interface CallContextType {
  isCallActive: boolean;
  duration: number;
  callingUser: CallingUser | null;
  callStatus: CallStatus;
  setCallActive: (active: boolean) => void;
  setDuration: (duration: number) => void;
  setCallingUser: (user: CallingUser | null) => void;
  setCallStatus: (status: CallStatus) => void;
  setActiveCall: (call: {
    isActive: boolean;
    duration: number;
    callingUser: CallingUser | null;
    callStatus: CallStatus;
  }) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('ended');

  const setCallActive = useCallback((active: boolean) => {
    setIsCallActive(active);
  }, []);

  const setActiveCall = useCallback(({ isActive, duration, callingUser, callStatus }) => {
    setIsCallActive(isActive);
    setDuration(duration);
    setCallingUser(callingUser);
    setCallStatus(callStatus);
  }, []);

  return (
    <CallContext.Provider
      value={{
        isCallActive,
        duration,
        callingUser,
        callStatus,
        setCallActive,
        setDuration,
        setCallingUser,
        setCallStatus,
        setActiveCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};