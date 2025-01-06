import { useState, useEffect } from "react";
import { Eye, Plus, Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const MedicalReportsCard = () => {
  const [medicalReportsCount, setMedicalReportsCount] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [medicalReports, setMedicalReports] = useState<any[]>([]);

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
        .eq('user_id', profileData.id);

      if (error) throw error;

      setMedicalReports(reports || []);
      setMedicalReportsCount(reports?.length || 0);
    } catch (error) {
      toast.error("Failed to fetch medical reports");
    }
  };

  useEffect(() => {
    fetchMedicalReports();
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in to upload files");
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

      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('medical_reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('medical_reports')
        .insert({
          user_id: profileData.id,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
        });

      if (dbError) throw dbError;

      toast.success("File uploaded successfully");
      fetchMedicalReports();
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(handleFileUpload);
      }
    };
    input.click();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Reports</CardTitle>
          <CardDescription>Manage your medical documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">{medicalReportsCount}</div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsViewDialogOpen(true)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medical Report</DialogTitle>
            <DialogDescription>
              Upload a file or take a picture
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleFileSelect}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCameraCapture}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Picture
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
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
                  onClick={async () => {
                    try {
                      const { data } = await supabase.storage
                        .from('medical_reports')
                        .createSignedUrl(report.file_path, 60);
                      
                      if (data?.signedUrl) {
                        window.open(data.signedUrl, '_blank');
                      }
                    } catch (error) {
                      toast.error("Failed to open file");
                    }
                  }}
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
    </>
  );
};