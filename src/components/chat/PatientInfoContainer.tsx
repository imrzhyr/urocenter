import { supabase } from "@/integrations/supabase/client";
import { PatientInfoCard } from "@/components/chat/PatientInfoCard";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface PatientInfoContainerProps {
  patientId?: string;
}

export const PatientInfoContainer = ({ patientId }: PatientInfoContainerProps) => {
  const { data: patientInfo, isLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      try {
        if (!patientId) return null;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, complaint, full_name, age, gender, phone, created_at')
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

          return {
            complaint: profileData.complaint || "",
            reportsCount: reports?.length || 0,
            fullName: profileData.full_name || "",
            age: profileData.age || "",
            gender: profileData.gender || "",
            isResolved: messageData?.is_resolved || false,
            phone: profileData.phone || "",
            createdAt: profileData.created_at || ""
          };
        }
        return null;
      } catch (error) {
        console.error('Error fetching patient info:', error);
        toast.error("Failed to load patient information");
        return null;
      }
    },
    enabled: !!patientId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  if (!patientId || !patientInfo) return null;

  return (
    <PatientInfoCard 
      userId={patientId}
      complaint={patientInfo.complaint}
      reportsCount={patientInfo.reportsCount}
      fullName={patientInfo.fullName}
      age={patientInfo.age}
      gender={patientInfo.gender}
      isResolved={patientInfo.isResolved}
      phone={patientInfo.phone}
      createdAt={patientInfo.createdAt}
    />
  );
};