import React from 'react';
import { BackButton } from "@/components/BackButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatientInfoContainer } from '../PatientInfoContainer';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FileText, User } from "lucide-react";

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

  return (
    <div className="flex items-center justify-between p-2 bg-primary text-white">
      <div className="flex items-center gap-2">
        <BackButton customRoute="/dashboard" />
        <div>
          <h3 className="font-medium text-sm">
            {patientName}
          </h3>
          <p className="text-xs text-white/80">
            {patientPhone || t('no_phone')}
          </p>
        </div>
      </div>

      {patientId && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-primary-foreground/10"
            >
              <User className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg">
            <PatientInfoContainer patientId={patientId} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};