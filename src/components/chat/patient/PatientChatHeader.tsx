import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from '@/hooks/useProfile';
import { BackButton } from "@/components/BackButton";
import { CallButton } from "../call/CallButton";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from '@/types/profile';

// Admin's UUID for the doctor
const DOCTOR_ID = "8d231b24-7163-4390-8361-4edb6f5f69d3";

interface PatientChatHeaderProps {
  patientProfile: Profile | null;
}

export const PatientChatHeader = ({ patientProfile }: PatientChatHeaderProps) => {
  if (!patientProfile) return null;

  return (
    <div className="flex items-center p-4 border-b bg-white dark:bg-gray-800">
      <BackButton />
      <div className="flex-1 ml-4">
        <h2 className="font-semibold text-lg">{patientProfile.full_name}</h2>
        <p className="text-sm text-gray-500">
          {patientProfile.age} • {patientProfile.gender}
        </p>
      </div>
      <CallButton 
        receiverId={DOCTOR_ID}
        recipientName="Doctor"
      />
    </div>
  );
};