import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText } from "lucide-react";

interface ViewReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export const ViewReportsDialog = ({ open, onOpenChange, userId }: ViewReportsDialogProps) => {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        return;
      }

      setReports(data || []);
    };

    if (open) {
      fetchReports();
    }
  }, [open, userId]);

  const handleFileClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Medical Reports</h2>
            {reports.length === 0 ? (
              <p className="text-sm text-gray-500">No medical reports found.</p>
            ) : (
              <div className="space-y-2">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => handleFileClick(report.file_path)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{report.file_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};