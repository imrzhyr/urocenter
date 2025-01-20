import { useState, useRef } from "react";
import { MedicalInformationHeader } from "@/components/medical-information/MedicalInformationHeader";
import { DocumentTypes } from "@/components/medical-information/DocumentTypes";
import { UploadSection } from "@/components/medical-information/UploadSection";
import { useFileUploadHandler } from "@/components/medical-information/FileUploadHandler";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MedicalInformation = () => {
  const { isUploading, uploadCount, handleFileUpload } = useFileUploadHandler();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = () => {
    const profileId = localStorage.getItem('profileId');
    if (!profileId) {
      toast.error(t("complete_profile_first"));
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleFileSelect = () => {
    const profileId = localStorage.getItem('profileId');
    if (!profileId) {
      toast.error(t("complete_profile_first"));
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.mp3,.wav';
    input.multiple = true;
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      if (files.length > 0) {
        for (const file of files) {
          await handleFileUpload(file);
        }
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto relative">
        <div className="px-4 py-6">
          <div className="max-w-md mx-auto">
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
            <div className="mt-6">
              <Button
                onClick={() => navigate("/payment")}
                className="w-full h-[44px] text-[17px] font-medium rounded-xl"
              >
                {t("continue")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInformation;