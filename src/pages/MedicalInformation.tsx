import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFileUploadHandler } from "@/components/medical-information/FileUploadHandler";
import { UploadSection } from "@/components/medical-information/UploadSection";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  file_path: string;
}

const MedicalInformation = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isUploading, handleFileUpload, uploadCount } = useFileUploadHandler();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = language === 'ar';

  useEffect(() => {
    fetchFiles();
  }, [uploadCount]);

  const fetchFiles = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        navigate("/signin", { replace: true });
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (!profileData) {
        navigate("/profile", { replace: true });
        return;
      }

      const { data: reports, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const filesWithUrls = await Promise.all((reports || []).map(async (report) => {
        const { data: { publicUrl } } = supabase.storage
          .from('medical_reports')
          .getPublicUrl(report.file_path);

        // Create a thumbnail URL for images
        let thumbnailUrl;
        if (report.file_type.startsWith('image/')) {
          thumbnailUrl = publicUrl;
        }

        return {
          id: report.id,
          name: report.file_name,
          type: report.file_type,
          url: publicUrl,
          thumbnailUrl: thumbnailUrl,
          file_path: report.file_path
        };
      }));

      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error(t("error_loading_files"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const file = files.find(f => f.id === id);
      if (!file) return;

      const { error: deleteStorageError } = await supabase.storage
        .from('medical_reports')
        .remove([file.file_path]);

      if (deleteStorageError) throw deleteStorageError;

      const { error: deleteRecordError } = await supabase
        .from('medical_reports')
        .delete()
        .eq('id', id);

      if (deleteRecordError) throw deleteRecordError;

      setFiles(files.filter(f => f.id !== id));
      toast.success(t("file_deleted"));
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(t("error_deleting_file"));
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.multiple = false;
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    };
    input.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "w-3 h-3",
            "rounded-full",
            "bg-[#0A84FF]"
          )}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "container mx-auto px-4 py-8",
        "min-h-screen",
        "bg-[#000B1D]"
      )}
    >
      <h1 className={cn(
        "text-[28px]", // iOS large title
        "font-bold",
        "mb-6",
        "text-[#0A84FF]",
        isRTL ? "text-right" : "text-left"
      )}>
        {t("medical_information")}
      </h1>
      <UploadSection
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
        files={files}
        onDeleteFile={handleDeleteFile}
      />
    </motion.div>
  );
}

export default MedicalInformation;