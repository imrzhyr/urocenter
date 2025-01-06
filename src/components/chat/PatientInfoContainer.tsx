import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PatientInfoCard } from "@/components/chat/PatientInfoCard";

export const PatientInfoContainer = () => {
  const [patientInfo, setPatientInfo] = useState<{
    complaint: string;
    reportsCount: number;
  }>({ complaint: "", reportsCount: 0 });

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) return;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, complaint')
          .eq('phone', userPhone)
          .maybeSingle();

        if (profileData) {
          const { data: reports } = await supabase
            .from('medical_reports')
            .select('id')
            .eq('user_id', profileData.id);

          setPatientInfo({
            complaint: profileData.complaint || "",
            reportsCount: reports?.length || 0
          });
        }
      } catch (error) {
        console.error('Error fetching patient info:', error);
      }
    };

    fetchPatientInfo();
  }, []);

  return (
    <PatientInfoCard 
      complaint={patientInfo.complaint}
      reportsCount={patientInfo.reportsCount}
    />
  );
};