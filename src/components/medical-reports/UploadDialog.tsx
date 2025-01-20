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
import { useLanguage } from "@/contexts/LanguageContext";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export const UploadDialog = ({ open, onOpenChange, onUploadSuccess }: UploadDialogProps) => {
  const { t } = useLanguage();

  const documentTypes = [
    {
      title: t('diagnostic_imaging'),
      items: [
        t('ultrasound_scans'),
        t('ct_scans'),
        t('mri_reports'),
        t('xrays'),
        t('nuclear_medicine_scans'),
      ],
    },
    {
      title: t('laboratory_results'),
      items: [
        t('psa_test'),
        t('urinalysis'),
        t('blood_test'),
        t('kidney_function'),
        t('hormone_levels'),
      ],
    },
    {
      title: t('medical_documentation'),
      items: [
        t('consultation_notes'),
        t('surgical_reports'),
        t('treatment_plans'),
        t('medication_history'),
        t('discharge_summaries'),
      ],
    },
  ];

  const handleFileUpload = async (file: File) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error(t('sign_in_to_upload'));
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError) {
        logger.error("Profile error", "Failed to fetch profile", profileError);
        toast.error(t('error_accessing_profile'));
        return;
      }

      if (!profileData) {
        toast.error(t('profile_not_found'));
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

      toast.success(t('file_upload_success'));
      onUploadSuccess();
      onOpenChange(false);
    } catch (error) {
      logger.error("Upload error", error instanceof Error ? error.message : 'Unknown error', error);
      toast.error(t('file_upload_failed'));
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
          <DialogTitle>{t('add_medical_report')}</DialogTitle>
          <DialogDescription>
            {t('upload_documents_description')}
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
              {t('upload_files')}
            </Button>
            <Button
              variant="outline"
              onClick={handleCameraCapture}
              className="flex-1 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
              {t('take_picture')}
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <Info className="w-4 h-4 inline-block mr-2" />
              {t('file_format_info')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};