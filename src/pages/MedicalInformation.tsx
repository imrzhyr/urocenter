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

const MedicalInformation = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) {
          toast.error("No user phone found");
          navigate("/signin", { replace: true });
          return;
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('full_name, complaint')
          .eq('phone', userPhone)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Error loading profile");
          navigate("/profile", { replace: true });
          return;
        }

        if (!profileData?.full_name || !profileData?.complaint) {
          toast.error("Please complete your profile first");
          navigate("/profile", { replace: true });
          return;
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error in checkUserProfile:", error);
        navigate("/profile", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkUserProfile();
  }, [navigate]);

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

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error("Please sign in to upload files");
        navigate("/signin", { replace: true });
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (!profileData) {
        toast.error("Profile not found");
        navigate("/profile", { replace: true });
        return;
      }

      const fileName = `${profileData.id}/${crypto.randomUUID()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('medical_reports')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      const { error: dbError } = await supabase
        .from('medical_reports')
        .insert({
          user_id: profileData.id,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
        });

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }

      setUploadCount(prev => prev + 1);
      toast.success(`File uploaded successfully (${uploadCount + 1} files uploaded)`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

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

  if (isLoading) {
    return <LoadingScreen message="Loading medical information..." />;
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Medical Information</h1>
        <p className="text-muted-foreground">
          Please upload your medical documents or take pictures
        </p>
        {uploadCount > 0 && (
          <p className="text-sm text-primary font-medium">
            {uploadCount} file{uploadCount !== 1 ? 's' : ''} uploaded successfully
          </p>
        )}
      </div>

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
        onClick={() => navigate("/payment", { replace: true })}
        disabled={isUploading}
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default MedicalInformation;