import { FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface MedicalReportsListProps {
  reports: any[];
  onImageSelect: (url: string) => void;
}

export const MedicalReportsList = ({ reports, onImageSelect }: MedicalReportsListProps) => {
  const { t } = useLanguage();

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{t('no_reports')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {reports.map((report) => {
        const isImage = report.file_type?.startsWith('image/');
        const fileUrl = supabase.storage
          .from('medical_reports')
          .getPublicUrl(report.file_path).data.publicUrl;

        if (isImage) {
          return (
            <div
              key={report.id}
              className="relative cursor-pointer rounded-lg overflow-hidden"
              onClick={() => onImageSelect(fileUrl)}
            >
              <img
                src={fileUrl}
                alt={report.file_name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-xs text-center px-2">
                  {report.file_name}
                </p>
              </div>
            </div>
          );
        }

        return (
          <a
            key={report.id}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm truncate">{report.file_name}</span>
          </a>
        );
      })}
    </div>
  );
};