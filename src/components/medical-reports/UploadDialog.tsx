import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export const UploadDialog = ({ open, onOpenChange, onUploadSuccess }: UploadDialogProps) => {
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
      onUploadSuccess();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};