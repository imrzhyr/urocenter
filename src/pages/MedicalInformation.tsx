import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DocumentTypeCard } from "@/components/medical-information/DocumentTypeCard";
import { UploadButtons } from "@/components/medical-information/UploadButtons";
import { MedicalInformationHeader } from "@/components/medical-information/MedicalInformationHeader";
import { useFileUploadHandler } from "@/components/medical-information/FileUploadHandler";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ScanLine, FileText } from "lucide-react";

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
    icon: FileText,
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
  const { profile, isLoading, refetch } = useOnboarding();

  useEffect(() => {
    const checkProfile = async () => {
      if (!profile?.full_name || !profile?.complaint) {
        toast.error("Please complete your profile first");
        navigate("/profile");
        return;
      }
      setIsPageLoading(false);
    };

    if (!isLoading) {
      checkProfile();
    }
  }, [navigate, profile, isLoading]);

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  }, [handleFileUpload]);

  const handleFileSelect = useCallback(() => {
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
  }, [handleFileUpload]);

  if (isPageLoading || isLoading) {
    return <LoadingScreen message="Loading medical information..." />;
  }

  return (
    <div className="space-y-6">
      <MedicalInformationHeader uploadCount={uploadCount} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((type) => (
          <DocumentTypeCard
            key={type.title}
            {...type}
          />
        ))}
      </div>

      <UploadButtons
        onCameraCapture={handleCameraCapture}
        onFileSelect={handleFileSelect}
        isUploading={isUploading}
      />

      <Button 
        className="w-full bg-primary hover:bg-primary/90"
        onClick={() => navigate("/payment")}
        disabled={isUploading}
      >
        Continue
      </Button>
    </div>
  );
};

export default MedicalInformation;