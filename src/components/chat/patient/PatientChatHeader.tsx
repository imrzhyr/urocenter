import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";
import { useNavigate } from "react-router-dom";
import { CallButton } from "@/components/call/CallButton";
import { useProfile } from "@/hooks/useProfile";

export const PatientChatHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <BackButton onClick={() => navigate("/dashboard")} />
        <div>
          <h3 className="font-medium text-white">
            {t('doctor_name')}
          </h3>
          <p className="text-sm text-white/80">{t('doctor_title')}</p>
        </div>
      </div>
      {profile?.id && (
        <CallButton userId={profile.id} />
      )}
    </div>
  );
};