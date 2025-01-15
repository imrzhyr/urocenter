import React from 'react';
import { DoctorChatHeader } from './DoctorChatHeader';
import { MessageContainer } from '../MessageContainer';
import { CallProvider } from '../call/CallProvider';

interface DoctorChatContainerProps {
  patientId: string;
  patientName: string;
  patientPhone: string | null;
  onRefresh: () => void;
}

export const DoctorChatContainer = ({ 
  patientId,
  patientName,
  patientPhone,
  onRefresh
}: DoctorChatContainerProps) => {
  return (
    <CallProvider>
      <div className="flex flex-col h-full bg-background">
        <DoctorChatHeader 
          patientId={patientId}
          patientName={patientName}
          patientPhone={patientPhone}
          onRefresh={onRefresh}
        />
        <MessageContainer />
      </div>
    </CallProvider>
  );
};