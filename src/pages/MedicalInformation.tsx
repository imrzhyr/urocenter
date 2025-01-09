import { useState, useRef } from "react";
import { MedicalInformationHeader } from "@/components/medical-information/MedicalInformationHeader";
import { DocumentTypes } from "@/components/medical-information/DocumentTypes";
import { UploadSection } from "@/components/medical-information/UploadSection";
import { FileUploadHandler } from "@/components/medical-information/FileUploadHandler";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MedicalInformation = () => {
  const [uploadCount, setUploadCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadComplete = () => {
    setUploadCount((prev) => prev + 1);
    setIsUploading(false);
  };

  const handleCameraCapture = () => {
    if (!profile?.id) {
      toast.error("Please complete your profile first");
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsUploading(true);
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${profile.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('medical-documents')
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('medical-documents')
            .getPublicUrl(filePath);

          await supabase.from('medical_documents').insert({
            user_id: profile.id,
            file_url: publicUrl,
            file_name: file.name,
            file_type: file.type,
          });

          toast.success('Document uploaded successfully');
          handleUploadComplete();
        } catch (error) {
          console.error('Error uploading document:', error);
          toast.error('Failed to upload document');
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  const handleFileSelect = () => {
    if (!profile?.id) {
      toast.error("Please complete your profile first");
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.mp3,.wav';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        setIsUploading(true);
        try {
          for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${profile.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('medical-documents')
              .upload(filePath, file);

            if (uploadError) {
              throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('medical-documents')
              .getPublicUrl(filePath);

            await supabase.from('medical_documents').insert({
              user_id: profile.id,
              file_url: publicUrl,
              file_name: file.name,
              file_type: file.type,
            });
          }

          toast.success(`${files.length} document(s) uploaded successfully`);
          handleUploadComplete();
        } catch (error) {
          console.error('Error uploading documents:', error);
          toast.error('Failed to upload documents');
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <MedicalInformationHeader uploadCount={uploadCount} />
      <DocumentTypes />
      <FileUploadHandler
        onUploadComplete={handleUploadComplete}
        setIsUploading={setIsUploading}
      >
        <UploadSection
          onCameraCapture={handleCameraCapture}
          onFileSelect={handleFileSelect}
          isUploading={isUploading}
        />
      </FileUploadHandler>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.mp3,.wav"
        multiple
      />
    </div>
  );
};

export default MedicalInformation;