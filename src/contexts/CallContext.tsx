import { createContext, useContext, useState, ReactNode } from "react";

interface CallContextType {
  activeCallId: string | null;
  callDuration: number;
  userId: string | null;
  setActiveCall: (callId: string, userId: string) => void;
  clearActiveCall: () => void;
  updateDuration: (duration: number) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const setActiveCall = (callId: string, newUserId: string) => {
    setActiveCallId(callId);
    setUserId(newUserId);
  };

  const clearActiveCall = () => {
    setActiveCallId(null);
    setUserId(null);
    setCallDuration(0);
  };

  const updateDuration = (duration: number) => {
    setCallDuration(duration);
  };

  return (
    <CallContext.Provider 
      value={{ 
        activeCallId, 
        callDuration, 
        userId,
        setActiveCall, 
        clearActiveCall,
        updateDuration
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