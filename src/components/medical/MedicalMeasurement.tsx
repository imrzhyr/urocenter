import { useLanguage } from "@/contexts/LanguageContext";
import { formatMedicalNumber } from "@/utils/numberFormatting";

interface MedicalMeasurementProps {
  value: number;
  unit: string;
  label: string;
  className?: string;
}

export const MedicalMeasurement = ({
  value,
  unit,
  label,
  className = ""
}: MedicalMeasurementProps) => {
  const { t, language } = useLanguage();

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <span className="text-sm text-gray-500">{t(label)}</span>
      <span className="text-lg font-medium">
        {formatMedicalNumber(value, t(unit), language)}
      </span>
    </div>
  );
};