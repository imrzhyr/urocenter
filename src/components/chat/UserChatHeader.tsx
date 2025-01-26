import React from 'react';
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { CallButton } from './call/CallButton';

interface UserChatHeaderProps {
  doctorId: string;
  doctorName: string;
  onRefresh?: () => void;
}

export const UserChatHeader = ({ 
  doctorId,
  doctorName,
  onRefresh 
}: UserChatHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between p-2 bg-primary text-white">
      <div className="flex items-center gap-2">
        <BackButton customRoute="/dashboard" />
        <div>
          <h3 className="font-medium">
            {doctorName}
          </h3>
          <p className="text-sm text-white/80">
            {t('online')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {doctorId && (
          <CallButton 
            receiverId={doctorId} 
            recipientName={doctorName}
            className="text-white hover:bg-primary-foreground/10"
          />
        )}
      </div>
    </div>
  );
}; 