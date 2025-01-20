import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatientActions } from "./patient-info/PatientActions";
import { PatientBasicInfo } from "./patient-info/PatientBasicInfo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatientInfoCardProps {
  userId: string;
  complaint?: string;
  reportsCount?: number;
  fullName?: string;
  age?: string;
  gender?: string;
  isResolved?: boolean;
  phone?: string;
  createdAt?: string;
}

export const PatientInfoCard = ({ 
  userId,
  complaint,
  reportsCount,
  fullName,
  age,
  gender,
  isResolved: initialIsResolved,
  phone,
  createdAt 
}: PatientInfoCardProps) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [isResolved, setIsResolved] = useState(initialIsResolved || false);

  useEffect(() => {
    if (!fullName) {
      fetchPatientInfo();
    }
  }, [userId, fullName]);

  const fetchPatientInfo = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(profile);

      // Check if there are any unresolved messages
      const { data: messages } = await supabase
        .from('messages')
        .select('is_resolved')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      setIsResolved(messages?.[0]?.is_resolved ?? false);
    } catch (error) {
      console.error('Error fetching patient info:', error);
      toast.error(t('error_loading_patient_info'));
    }
  };

  const handleToggleResolved = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_resolved: !isResolved })
        .eq('user_id', userId);

      if (error) throw error;

      setIsResolved(!isResolved);
      toast.success(t(isResolved ? 'marked_as_unresolved' : 'marked_as_resolved'));
    } catch (error) {
      console.error('Error toggling resolved status:', error);
      toast.error(t('error_updating_status'));
    }
  };

  const displayProfile = profile || {
    full_name: fullName,
    age,
    gender,
    phone,
    created_at: createdAt
  };

  if (!displayProfile) return null;

  return (
    <Card className="p-4 space-y-4">
      <PatientBasicInfo
        fullName={displayProfile.full_name}
        age={displayProfile.age}
        gender={displayProfile.gender}
        phone={displayProfile.phone}
        createdAt={displayProfile.created_at}
      />

      <PatientActions
        isResolved={isResolved}
        onToggleResolved={handleToggleResolved}
      />
    </Card>
  );
};