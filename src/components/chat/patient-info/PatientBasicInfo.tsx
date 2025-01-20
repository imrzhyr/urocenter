import { useLanguage } from "@/contexts/LanguageContext";

interface PatientBasicInfoProps {
  age: string;
  gender: string;
  phone?: string;
}

export const PatientBasicInfo = ({ age, gender, phone }: PatientBasicInfoProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center min-h-[44px] px-1">
        <h3 className="text-[17px] text-[#1c1c1e] dark:text-white font-normal">{t('age')}</h3>
        <p className="text-[17px] text-[#8e8e93] dark:text-[#98989d]">{age || t('not_provided')}</p>
      </div>
      <div className="flex justify-between items-center min-h-[44px] px-1">
        <h3 className="text-[17px] text-[#1c1c1e] dark:text-white font-normal">{t('gender')}</h3>
        <p className="text-[17px] text-[#8e8e93] dark:text-[#98989d]">{gender || t('not_provided')}</p>
      </div>
      <div className="flex justify-between items-center min-h-[44px] px-1">
        <h3 className="text-[17px] text-[#1c1c1e] dark:text-white font-normal">{t('phone')}</h3>
        <p className="text-[17px] text-[#8e8e93] dark:text-[#98989d]">{phone || t('not_provided')}</p>
      </div>
    </div>
  );
};