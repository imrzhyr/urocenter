import { useState, useRef } from "react";
import { MedicalInformationHeader } from "@/components/medical-information/MedicalInformationHeader";
import { DocumentTypes } from "@/components/medical-information/DocumentTypes";
import { UploadSection } from "@/components/medical-information/UploadSection";
import { useFileUploadHandler } from "@/components/medical-information/FileUploadHandler";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MedicalInformation = () => {
  const { isUploading, uploadCount, handleFileUpload } = useFileUploadHandler();
  const { profile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        await handleFileUpload(file);
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
        for (const file of files) {
          await handleFileUpload(file);
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <MedicalInformationHeader uploadCount={uploadCount} />
      <DocumentTypes />
      <UploadSection
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />
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