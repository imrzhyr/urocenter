import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Trash2, Image } from "lucide-react";
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

  useEffect(() => {
    if (open) {
      fetchReports();
    }
  }, [open, userId, profile?.id]);

  const fetchReports = async () => {
    const targetUserId = userId || profile?.id;
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load medical reports');
    }
  };

  const handleDelete = async (reportId: string, filePath: string) => {
    try {
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

      setReports(reports.filter(report => report.id !== reportId));
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const isImageFile = (fileType: string) => fileType?.startsWith('image/');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Medical Reports</h2>
          
          <AnimatePresence>
            {reports.length === 0 ? (
              <p className="text-sm text-gray-500">No medical reports found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((report) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group"
                  >
                    {isImageFile(report.file_type) ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={supabase.storage.from('medical_reports').getPublicUrl(report.file_path).data.publicUrl}
                          alt={report.file_name}
                          className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                          onClick={() => setSelectedImage(supabase.storage.from('medical_reports').getPublicUrl(report.file_path).data.publicUrl)}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(report.id, report.file_path)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center p-4 border rounded-lg group-hover:border-destructive transition-colors">
                        <FileText className="h-6 w-6 mr-2" />
                        <span className="flex-1 truncate">{report.file_name}</span>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(report.id, report.file_path)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl p-0">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto"
                onClick={() => setSelectedImage(null)}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};