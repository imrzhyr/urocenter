import React, { createContext, useContext, useState } from 'react';

interface CallContextType {
  activeCallId: string | null;
  callDuration: number;
  userId: string | null;
  clearActiveCall: () => void;
}

const CallContext = createContext<CallContextType>({
  activeCallId: null,
  callDuration: 0,
  userId: null,
  clearActiveCall: () => {},
});

export const useCall = () => useContext(CallContext);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCallId] = useState<string | null>(null);
  const [callDuration] = useState(0);
  const [userId] = useState<string | null>(null);

  const clearActiveCall = () => {
    // Empty function since we're removing call functionality
  };

  return (
    <CallContext.Provider
      value={{
        activeCallId,
        callDuration,
        userId,
        clearActiveCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};