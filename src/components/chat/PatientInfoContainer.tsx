import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PatientInfoCard } from "@/components/chat/PatientInfoCard";
import { toast } from "sonner";

interface PatientInfoContainerProps {
  patientId?: string;
}

export const PatientInfoContainer = ({ patientId }: PatientInfoContainerProps) => {
  const [patientInfo, setPatientInfo] = useState<{
    complaint: string;
    reportsCount: number;
    fullName: string;
    age: string;
    gender: string;
    isResolved: boolean;
  }>({ 
    complaint: "", 
    reportsCount: 0,
    fullName: "",
    age: "",
    gender: "",
    isResolved: false
  });

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        if (!patientId) return;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, complaint, full_name, age, gender')
          .eq('id', patientId)
          .single();

        if (profileData) {
          const { data: reports } = await supabase
            .from('medical_reports')
            .select('id')
            .eq('user_id', profileData.id);

          const { data: messageData } = await supabase
            .from('messages')
            .select('is_resolved')
            .eq('user_id', patientId)
            .limit(1)
            .single();

          setPatientInfo({
            complaint: profileData.complaint || "",
            reportsCount: reports?.length || 0,
            fullName: profileData.full_name || "",
            age: profileData.age || "",
            gender: profileData.gender || "",
            isResolved: messageData?.is_resolved || false
          });
        }
      } catch (error) {
        console.error('Error fetching patient info:', error);
        toast.error("Failed to load patient information");
      }
    };

    fetchPatientInfo();
  }, [patientId]);

  if (!patientId) return null;

  return (
    <PatientInfoCard 
      complaint={patientInfo.complaint}
      reportsCount={patientInfo.reportsCount}
      fullName={patientInfo.fullName}
      age={patientInfo.age}
      gender={patientInfo.gender}
      patientId={patientId}
      isResolved={patientInfo.isResolved}
    />
  );
};