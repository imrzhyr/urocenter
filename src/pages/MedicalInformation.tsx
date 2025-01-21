import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFileUploadHandler } from "@/components/medical-information/FileUploadHandler";
import { UploadSection } from "@/components/medical-information/UploadSection";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  const { isUploading, handleFileUpload, uploadCount } = useFileUploadHandler();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      const fileToDelete = files.find(f => f.id === id);
      if (!fileToDelete) return;

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('medical_reports')
        .remove([fileToDelete.file_path]);

      if (storageError) throw storageError;

      // Then delete from database
      const { error: dbError } = await supabase
        .from('medical_reports')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Update local state
      setFiles(files.filter(f => f.id !== id));
      toast.success(t("file_deleted_successfully"), {
        position: "top-center"
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(t("error_deleting_file"), {
        position: "top-center"
      });
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("medical_information")}</h1>
      <UploadSection
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
        files={files}
        onDeleteFile={handleDeleteFile}
      />
    </div>
  );
};

export default MedicalInformation;