import React, { useState } from 'react';
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatientInfoContainer } from '../PatientInfoContainer';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { CallButton } from '../call/CallButton';

interface DoctorChatHeaderProps {
  patientId?: string;
  patientName: string;
  patientPhone?: string;
  onRefresh?: () => void;
}

export const DoctorChatHeader = ({ 
  patientId,
  patientName,
  patientPhone,
  onRefresh 
}: DoctorChatHeaderProps) => {
  const { t } = useLanguage();
  const [showPatientInfo, setShowPatientInfo] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-2 bg-primary text-white">
        <div className="flex items-center gap-2">
          <BackButton customRoute="/dashboard" />
          <div>
            <h3 className="font-medium">
              {patientName}
            </h3>
            <p className="text-sm text-white/80">
              {patientPhone || t('no_phone')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {patientId && (
            <>
              <CallButton 
                receiverId={patientId} 
                recipientName={patientName}
                className="text-white hover:bg-primary-foreground/10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-primary-foreground/10"
                onClick={() => setShowPatientInfo(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {showPatientInfo && (
        <PatientInfoContainer 
          patientId={patientId} 
          onClose={() => setShowPatientInfo(false)}
        />
      )}
    </>
  );
};