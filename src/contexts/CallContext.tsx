import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CallingUser } from "@/types/call";

interface CallContextType {
  isCallActive: boolean;
  duration: number;
  callingUser: CallingUser | null;
  activeCallId: string | null;
  setCallActive: (active: boolean) => void;
  setDuration: (duration: number) => void;
  setCallingUser: (user: CallingUser | null) => void;
  setActiveCallId: (id: string | null) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [callingUser, setCallingUser] = useState<CallingUser | null>(null);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  const setCallActive = useCallback((active: boolean) => {
    setIsCallActive(active);
  }, []);

  return (
    <CallContext.Provider
      value={{
        isCallActive,
        duration,
        callingUser,
        activeCallId,
        setCallActive,
        setDuration,
        setCallingUser,
        setActiveCallId,
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