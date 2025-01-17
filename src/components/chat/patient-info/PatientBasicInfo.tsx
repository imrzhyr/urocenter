import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientBasicInfoProps {
  fullName: string;
  age: string;
  gender: string;
  phone?: string;
  createdAt?: string;
}

export const PatientBasicInfo = ({ fullName, age, gender, phone, createdAt }: PatientBasicInfoProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{t('full_name')}</h3>
        <p>{fullName || t('not_provided')}</p>
      </div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{t('age')}</h3>
        <p>{age || t('not_provided')}</p>
      </div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{t('gender')}</h3>
        <p>{gender || t('not_provided')}</p>
      </div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{t('phone')}</h3>
        <p>{phone || t('not_provided')}</p>
      </div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{t('member_since')}</h3>
        <p>{createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : t('not_provided')}</p>
      </div>
    </div>
  );
};