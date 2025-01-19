import { Camera, Upload, Info } from "lucide-react";
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
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logger } from '@/utils/logger';
import { uploadMedicalFile } from "@/utils/medicalFileUpload";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

const documentTypes = [
  {
    title: "Diagnostic Imaging",
    items: [
      "Ultrasound scans of kidneys, bladder, and prostate",
      "CT scans of the urinary tract",
      "MRI reports of the pelvic area",
      "X-rays of the urinary system",
      "Nuclear medicine scan results",
    ],
  },
  {
    title: "Laboratory Results",
    items: [
      "PSA (Prostate-Specific Antigen) test results",
      "Urinalysis reports",
      "Blood test results",
      "Kidney function tests",
      "Hormone level assessments",
    ],
  },
  {
    title: "Medical Documentation",
    items: [
      "Previous consultation notes",
      "Surgical reports and post-operative notes",
      "Treatment plans and protocols",
      "Medication prescriptions and history",
      "Hospital discharge summaries",
    ],
  },
];

export const UploadDialog = ({ open, onOpenChange, onUploadSuccess }: UploadDialogProps) => {
  const handleFileUpload = async (file: File) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in to upload files");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError) {
        logger.error("Profile error", "Failed to fetch profile", profileError);
        toast.error("Error accessing profile");
        return;
      }

      if (!profileData) {
        toast.error("Profile not found");
        return;
      }

      const { url, name, type } = await uploadMedicalFile(file);

      const { error: dbError } = await supabase
        .from('medical_reports')
        .insert({
          user_id: profileData.id,
          file_name: name,
          file_path: url.split('/').pop() || '',
          file_type: type,
        });

      if (dbError) {
        logger.error("Database insert error", dbError.message, dbError);
        throw dbError;
      }

      toast.success("File uploaded successfully");
      onUploadSuccess();
      onOpenChange(false);
    } catch (error) {
      logger.error("Upload error", error instanceof Error ? error.message : 'Unknown error', error);
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Medical Report</DialogTitle>
          <DialogDescription>
            Upload your medical documents or take pictures. Please ensure all documents are clear and readable.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          <ScrollArea className="h-[300px] pr-4 rounded-md border p-4">
            <div className="space-y-6">
              {documentTypes.map((category) => (
                <div key={category.title} className="animate-fade-in">
                  <h3 className="font-semibold text-lg text-primary mb-2">
                    {category.title}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {category.items.map((item) => (
                      <li key={item} className="text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleFileSelect}
              className="flex-1 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
            <Button
              variant="outline"
              onClick={handleCameraCapture}
              className="flex-1 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
              Take Picture
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <Info className="w-4 h-4 inline-block mr-2" />
              We accept files in PDF, JPG, JPEG, and PNG formats. Each file should be less than 10MB.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};