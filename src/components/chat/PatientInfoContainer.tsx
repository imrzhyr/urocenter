import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PatientInfoCard } from "@/components/chat/PatientInfoCard";

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
  }>({ 
    complaint: "", 
    reportsCount: 0,
    fullName: "",
    age: "",
    gender: ""
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

          setPatientInfo({
            complaint: profileData.complaint || "",
            reportsCount: reports?.length || 0,
            fullName: profileData.full_name || "",
            age: profileData.age || "",
            gender: profileData.gender || ""
          });
        }
      } catch (error) {
        console.error('Error fetching patient info:', error);
      }
    };

    fetchPatientInfo();
  }, [patientId]);

  return (
    <PatientInfoCard 
      complaint={patientInfo.complaint}
      reportsCount={patientInfo.reportsCount}
      fullName={patientInfo.fullName}
      age={patientInfo.age}
      gender={patientInfo.gender}
    />
  );
};