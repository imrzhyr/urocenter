import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Trash2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ViewReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export const ViewReportsDialog = ({ open, onOpenChange, userId }: ViewReportsDialogProps) => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { profile } = useProfile();

  const fetchReports = async () => {
    const targetUserId = userId || profile?.id;
    if (!targetUserId) return;

    const { data, error } = await supabase
      .from('medical_reports')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return;
    }

    setReports(data || []);
  };

  useEffect(() => {
    if (open) {
      fetchReports();
    }
  }, [open, userId, profile?.id]);

  const handleDelete = async (reportId: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('medical_reports')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('medical_reports')
        .delete()
        .eq('id', reportId);

      if (dbError) throw dbError;

      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const isImageFile = (fileType: string) => {
    return fileType?.startsWith('image/');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Medical Reports</h2>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-500">No medical reports found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {reports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group"
                  >
                    {isImageFile(report.file_type) ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={supabase.storage.from('medical_reports').getPublicUrl(report.file_path).data.publicUrl}
                          alt={report.file_name}
                          className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                          onClick={() => setSelectedImage(report.file_path)}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleDelete(report.id, report.file_path)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative aspect-square rounded-lg border p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-center truncate w-full">
                          {report.file_name}
                        </span>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleDelete(report.id, report.file_path)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl p-0">
              <img
                src={supabase.storage.from('medical_reports').getPublicUrl(selectedImage).data.publicUrl}
                alt="Preview"
                className="w-full h-auto"
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};