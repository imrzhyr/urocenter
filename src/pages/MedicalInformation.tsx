import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileImage, Camera, ScanLine, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DocumentTypeCard } from "@/components/medical-information/DocumentTypeCard";
import { UploadButtons } from "@/components/medical-information/UploadButtons";
import { MedicalInformationHeader } from "@/components/medical-information/MedicalInformationHeader";
import { useFileUploadHandler } from "@/components/medical-information/FileUploadHandler";
import { useProfile } from "@/hooks/useProfile";

const documentTypes = [
  {
    title: "Diagnostic Imaging",
    icon: ScanLine,
    description: "Upload CT scans, X-rays, or MRI results",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Lab Reports",
    icon: FileText,
    description: "Blood tests, urinalysis, or other lab results",
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Medical Records",
    icon: FileImage,
    description: "Previous medical records or doctor's notes",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Other Documents",
    icon: FileText,
    description: "Any other relevant medical documentation",
    color: "bg-orange-50 text-orange-600",
  },
];

const MedicalInformation = () => {
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { isUploading, uploadCount, handleFileUpload } = useFileUploadHandler();
  const { profile, isLoading: isProfileLoading } = useProfile();

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          toast.error("Please sign in first");
          navigate("/signin");
          return;
        }

        if (!profile?.full_name || !profile?.complaint) {
          toast.error("Please complete your profile first");
          navigate("/profile");
          return;
        }

        setIsPageLoading(false);
      } catch (error) {
        console.error("Error in checkUserProfile:", error);
        toast.error("Error loading profile");
        navigate("/profile");
      }
    };

    if (!isProfileLoading) {
      checkUserProfile();
    }
  }, [navigate, profile, isProfileLoading]);

  if (isPageLoading || isProfileLoading) {
    return <LoadingScreen message="Loading medical information..." />;
  }

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <MedicalInformationHeader uploadCount={uploadCount} />

      <div className="grid grid-cols-2 gap-4">
        {documentTypes.map((type) => (
          <DocumentTypeCard
            key={type.title}
            {...type}
            onClick={handleFileSelect}
          />
        ))}
      </div>

      <UploadButtons
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />

      <Button 
        className="w-full"
        onClick={() => navigate("/payment")}
        disabled={isUploading}
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default MedicalInformation;