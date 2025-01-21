import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChatImagePreview } from "@/features/chat/components/ChatImagePreview/ChatImagePreview";
import { cn } from "@/lib/utils";

interface ViewReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

interface Report {
  id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  created_at: string;
  url?: string;
}

export const ViewReportsDialog = ({ open, onOpenChange, userId }: ViewReportsDialogProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          toast.error(t('sign_in_to_access_records'));
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone', userPhone)
          .maybeSingle();

        if (profileError || !profileData) {
          console.error('Error fetching profile:', profileError);
          toast.error(t('error_accessing_profile'));
          return;
        }

        userId = profileData.id;
      }

      console.log('Fetching reports for user ID:', userId);
      
      if (!userId) {
        console.log('No target user ID found');
        return;
      }

      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log('Fetched reports data:', data);
      console.log('Fetch error if any:', error);

      if (error) {
        console.error('Error fetching reports:', error);
        toast.error(t('error_fetching_reports'));
        return;
      }

      const reportsWithUrls = await Promise.all((data || []).map(async (report) => {
        const { data: urlData } = supabase.storage
          .from('medical_reports')
          .getPublicUrl(report.file_path);
          
        console.log('Generated URL for report:', report.file_path, urlData?.publicUrl);
        return {
          ...report,
          url: urlData?.publicUrl
        };
      }));

      console.log('Final reports with URLs:', reportsWithUrls);
      setReports(reportsWithUrls);
    };

    if (open) {
      fetchReports();
    }
  }, [open, userId, t]);

  const handleDelete = async (reportId: string, filePath: string) => {
    try {
      setIsDeleting(true);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('medical_reports')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('medical_reports')
        .delete()
        .eq('id', reportId);

      if (dbError) throw dbError;

      // Update local state
      setReports(reports.filter(report => report.id !== reportId));
      toast.success(t('file_deleted_successfully'));
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error(t('error_deleting_file'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageClick = (url: string | undefined) => {
    if (url) {
      setSelectedImage(url);
      onOpenChange(false); // Close the dialog when opening image preview
    }
  };

  const handleImageClose = () => {
    setSelectedImage(null);
    onOpenChange(true); // Reopen the dialog when closing image preview
  };

  return (
    <>
      <Dialog open={open && !selectedImage} onOpenChange={onOpenChange}>
        <DialogContent className={cn(
          "bg-white dark:bg-[#1C1C1E]",
          "border-0",
          "text-[#1C1C1E] dark:text-white",
          "rounded-2xl shadow-lg",
          "w-[85vw] max-w-[320px]",
          "mx-auto",
          "my-8",
          "p-6"
        )}>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-[22px] font-semibold text-center">
              {t('medical_reports')}
            </DialogTitle>
            <DialogDescription className="text-[17px] text-[#8E8E93] dark:text-[#98989D] text-center">
              {t('view_medical_reports')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="space-y-1.5">
              <p className="text-[15px] text-[#8E8E93] dark:text-[#98989D] text-center">
                {t('medical_reports_description')}
              </p>
            </div>

            {reports.length === 0 ? (
              <div className="min-h-[160px] flex items-center justify-center rounded-xl border-2 border-dashed border-[#C6C6C8] dark:border-[#38383A]">
                <p className="text-[17px] text-[#8E8E93] dark:text-[#98989D]">
                  {t('no_medical_reports')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={cn(
                      "group relative aspect-square rounded-xl overflow-hidden bg-[#F2F2F7] dark:bg-[#2C2C2E]",
                      "min-h-[44px] min-w-[44px]",
                      "hover:ring-2 hover:ring-[#007AFF] dark:hover:ring-[#0A84FF] transition-all"
                    )}
                  >
                    <img
                      src={report.url}
                      alt={t('medical_report')}
                      className="w-full h-full object-cover cursor-pointer transition-opacity"
                      onClick={() => handleImageClick(report.url)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className={cn(
                        "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
                        "h-11 w-11 rounded-full",
                        "bg-red-600/90 hover:bg-red-700 shadow-lg"
                      )}
                      onClick={() => handleDelete(report.id, report.file_path)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">{t('delete_report')}</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <ChatImagePreview
          url={selectedImage}
          onClose={handleImageClose}
        />
      )}
    </>
  );
};