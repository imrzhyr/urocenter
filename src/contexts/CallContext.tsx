import React, { createContext, useContext } from 'react';

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
  return (
    <CallContext.Provider
      value={{
        activeCallId: null,
        callDuration: 0,
        userId: null,
        clearActiveCall: () => {},
      }}
    >
      {children}
    </CallContext.Provider>
  );
};