import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientActionsProps {
  isResolved: boolean;
  onToggleResolved: () => void;
}

export const PatientActions = ({ 
  isResolved, 
  onToggleResolved 
}: PatientActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={isResolved ? "destructive" : "default"}
        className="w-full"
        onClick={onToggleResolved}
      >
        {isResolved ? t('mark_unresolved') : t('mark_resolved')}
      </Button>
    </div>
  );
};