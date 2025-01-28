import React from "react";
import { Camera, Upload, SunMedium, FileText, Clock, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FilePreview } from "./FilePreview";
import { FilePreviewModal } from "./FilePreviewModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
}

interface UploadSectionProps {
  onCameraCapture: () => void;
  onFileSelect: () => void;
  isUploading: boolean;
  files: UploadedFile[];
  onDeleteFile: (id: string) => void;
}

export const UploadSection = ({
  onCameraCapture,
  onFileSelect,
  isUploading,
  files,
  onDeleteFile,
}: UploadSectionProps) => {
  const { t } = useLanguage();
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const navigate = useNavigate();

  const buttonAnimation = {
    tap: { scale: 0.98 }
  };

  const handlePreview = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      setPreviewFile(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (onDeleteFile) {
      onDeleteFile(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Information Card with Buttons */}
      <div className={cn(
        "rounded-2xl overflow-hidden",
        "bg-white dark:bg-white/5",
        "border border-[#CBDCEB] dark:border-[#CBDCEB]/20",
        "shadow-sm"
      )}>
        {/* Header */}
        <div className="px-6 py-4 bg-[#CBDCEB]/20 dark:bg-[#CBDCEB]/10 border-b border-[#CBDCEB] dark:border-[#CBDCEB]/20">
          <h2 className="text-lg font-semibold text-[#007AFF] dark:text-[#0A84FF]">
            {t("upload_guidelines")}
          </h2>
        </div>

        {/* Guidelines */}
        <div className="p-6 space-y-6">
          {/* Guideline 1 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#CBDCEB]/50 dark:bg-[#CBDCEB]/10 flex items-center justify-center">
              <SunMedium className="w-5 h-5 text-[#608BC1] dark:text-[#608BC1]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#007AFF] dark:text-[#0A84FF]">
                {t("upload_guideline_1_title")}
              </p>
              <p className="mt-1 text-sm text-[#608BC1] dark:text-[#CBDCEB]/70">
                {t("upload_guideline_1")}
              </p>
            </div>
          </div>

          {/* Guideline 2 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#CBDCEB]/50 dark:bg-[#CBDCEB]/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#608BC1] dark:text-[#608BC1]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#007AFF] dark:text-[#0A84FF]">
                {t("upload_guideline_2_title")}
              </p>
              <p className="mt-1 text-sm text-[#608BC1] dark:text-[#CBDCEB]/70">
                {t("upload_guideline_2")}
              </p>
            </div>
          </div>

          {/* Guideline 3 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#CBDCEB]/50 dark:bg-[#CBDCEB]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#608BC1] dark:text-[#608BC1]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#007AFF] dark:text-[#0A84FF]">
                {t("upload_guideline_3_title")}
              </p>
              <p className="mt-1 text-sm text-[#608BC1] dark:text-[#CBDCEB]/70">
                {t("upload_guideline_3")}
              </p>
            </div>
          </div>

          {/* Upload Buttons */}
          <div className="flex justify-center gap-4 pt-6 px-6">
            <Button
              className={cn(
                "w-full max-w-[200px] h-12",
                "bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] dark:hover:bg-[#0071E3]",
                "text-white font-medium",
                "rounded-xl",
                "border-0",
                "shadow-sm hover:shadow-md",
                "transition-all duration-200"
              )}
              onClick={onCameraCapture}
              disabled={isUploading}
            >
              <Camera className="w-5 h-5 mr-2" />
              {t("take_picture")}
            </Button>
            <Button
              className={cn(
                "w-full max-w-[200px] h-12",
                "bg-[#007AFF] hover:bg-[#0071E3] dark:bg-[#0A84FF] dark:hover:bg-[#0071E3]",
                "text-white font-medium",
                "rounded-xl",
                "border-0",
                "shadow-sm hover:shadow-md",
                "transition-all duration-200"
              )}
              onClick={onFileSelect}
              disabled={isUploading}
            >
              <Upload className="w-5 h-5 mr-2" />
              {t("upload_files")}
            </Button>
          </div>
        </div>
      </div>

      {/* File Preview */}
      <FilePreview
        files={files}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      {/* Preview Modal */}
      <FilePreviewModal
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />

      {/* iOS-style Continue Button */}
      <motion.button
        variants={buttonAnimation}
        whileTap="tap"
        onClick={() => {
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(2);
          }
          navigate("/payment");
        }}
        className={cn(
          "w-full h-[44px]",
          "text-[17px] font-medium",
          "rounded-xl",
          "bg-[#0A84FF]",
          "hover:bg-[#0A84FF]/90",
          "active:bg-[#0A84FF]/80",
          "text-white",
          "transition-colors duration-200"
        )}
      >
        {t("continue_to_payment")}
      </motion.button>
    </div>
  );
};