import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useProfile";
import { BackButton } from "@/components/BackButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const { profile } = useProfile();
  const [adminId, setAdminId] = useState<string>();

  useEffect(() => {
    const fetchAdminId = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error('Error fetching admin ID:', error);
        toast.error('Could not fetch admin details');
        return;
      }

      if (data) {
        setAdminId(data.id);
      }
    };

    fetchAdminId();
  }, []);

  if (!profile?.id) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-primary">
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h3 className="font-medium text-white">
            {t('doctor_name')}
          </h3>
          <p className="text-sm text-white/80">{t('doctor_title')}</p>
        </div>
      </div>
    </div>
  );
};