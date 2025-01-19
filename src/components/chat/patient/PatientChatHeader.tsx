import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from '@/hooks/useProfile';
import { BackButton } from "@/components/BackButton";
import { CallButton } from "../call/CallButton";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Admin's UUID for the doctor
const DOCTOR_ID = "8d231b24-7163-4390-8361-4edb6f5f69d3";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const { id: patientId } = useParams();

  const { data: patientProfile } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();
      return data;
    },
    enabled: !!patientId
  });

  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <BackButton customRoute="/dashboard" />
        <div>
          <h3 className="font-medium text-white text-sm">
            {patientProfile?.full_name || "Loading..."}
          </h3>
          <p className="text-xs text-white/80">
            {patientProfile?.phone || "Loading..."}
          </p>
        </div>
      </div>
      <CallButton 
        receiverId={DOCTOR_ID}
        recipientName={t('doctor_name')}
        className="text-white hover:bg-primary-foreground/10 h-8 w-8"
      />
    </div>
  );
};