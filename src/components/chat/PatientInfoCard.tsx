import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatientActions } from "./patient-info/PatientActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatientInfoCardProps {
  userId: string;
}

export const PatientInfoCard = ({ userId }: PatientInfoCardProps) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    fetchPatientInfo();
  }, [userId]);

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

  if (!profile) return null;

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{profile.full_name}</h3>
        <p className="text-sm text-muted-foreground">
          {t('member_since')}: {format(new Date(profile.created_at), 'MMM dd, yyyy')}
        </p>
      </div>

      <PatientActions
        isResolved={isResolved}
        onToggleResolved={handleToggleResolved}
      />
    </Card>
  );
};