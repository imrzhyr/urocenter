import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PatientActionsProps {
  isResolved: boolean;
  reportsCount: number;
  onToggleResolved: () => void;
  onViewReports: () => void;
}

export const PatientActions = ({ 
  isResolved, 
  reportsCount, 
  onToggleResolved, 
  onViewReports 
}: PatientActionsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        className="w-full justify-start gap-2"
        onClick={onViewReports}
      >
        <FileText className="h-4 w-4" />
        {t('view_reports')} ({reportsCount})
      </Button>
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