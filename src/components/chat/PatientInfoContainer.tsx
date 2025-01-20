import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PatientInfoCard } from "@/components/chat/PatientInfoCard";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";

interface PatientInfoContainerProps {
  patientId?: string;
  onClose?: () => void;
}

export const PatientInfoContainer = ({ patientId, onClose }: PatientInfoContainerProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const { data: patientInfo, isLoading, refetch } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      try {
        if (!patientId) return null;

        const { data: profileData } = await supabase
          .from('profiles')
          .select(`
            id,
            complaint,
            age,
            gender,
            phone,
            created_at,
            updated_at,
            auth_method,
            last_login,
            role,
            payment_status,
            payment_method,
            payment_date,
            payment_approval_status
          `)
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
            age: profileData.age || "",
            gender: profileData.gender || "",
            isResolved: messageData?.is_resolved || false,
            phone: profileData.phone || ""
          };
        }
        return null;
      } catch (error) {
        console.error('Error fetching patient info:', error);
        toast.error(t("failed_load_patient_info"));
        return null;
      }
    },
    enabled: !!patientId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (!patientId) return;

    const channel = supabase
      .channel(`profile_${patientId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${patientId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId, refetch]);

  if (!patientId || !patientInfo) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <PatientInfoCard 
          complaint={patientInfo.complaint}
          reportsCount={patientInfo.reportsCount}
          age={patientInfo.age}
          gender={patientInfo.gender}
          patientId={patientId}
          isResolved={patientInfo.isResolved}
          phone={patientInfo.phone}
          onClose={handleClose}
        />
      )}
    </AnimatePresence>
  );
};