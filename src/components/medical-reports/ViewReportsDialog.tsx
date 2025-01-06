import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ViewReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewReportsDialog = ({ open, onOpenChange }: ViewReportsDialogProps) => {
  const [medicalReports, setMedicalReports] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchMedicalReports();
    }
  }, [open]);

  const fetchMedicalReports = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in to view medical reports");
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (!profileData) {
        toast.error("Profile not found");
        return;
      }

      const { data: reports, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMedicalReports(reports || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch medical reports");
    }
  };

  const handleViewFile = async (report: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical_reports')
        .createSignedUrl(report.file_path, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error("View error:", error);
      toast.error("Failed to open file");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Your Medical Reports</DialogTitle>
          <DialogDescription>
            View all your uploaded medical reports
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {medicalReports.map((report) => (
            <div key={report.id} className="p-4 border rounded-lg">
              <p className="font-medium truncate">{report.file_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(report.created_at).toLocaleDateString()}
              </p>
              <Button
                variant="link"
                className="mt-2 p-0"
                onClick={() => handleViewFile(report)}
              >
                View File
              </Button>
            </div>
          ))}
          {medicalReports.length === 0 && (
            <p className="text-muted-foreground col-span-2 text-center py-4">
              No medical reports uploaded yet
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};