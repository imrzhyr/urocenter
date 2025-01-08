import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileImage, Camera, ScanLine, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MedicalInformation = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const documentTypes = [
    {
      title: "Diagnostic Imaging",
      icon: <ScanLine className="w-6 h-6" />,
      description: "Upload CT scans, X-rays, or MRI results",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Lab Reports",
      icon: <FileText className="w-6 h-6" />,
      description: "Blood tests, urinalysis, or other lab results",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Medical Records",
      icon: <FileImage className="w-6 h-6" />,
      description: "Previous medical records or doctor's notes",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Other Documents",
      icon: <FileText className="w-6 h-6" />,
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
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .single();

      if (!profileData) {
        toast.error("Profile not found");
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

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
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
          <motion.div
            key={type.title}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg ${type.color} transition-colors cursor-pointer`}
            onClick={handleFileSelect}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              {type.icon}
              <h3 className="font-semibold">{type.title}</h3>
              <p className="text-sm opacity-75">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
          onClick={handleCameraCapture}
          disabled={isUploading}
        >
          <Camera className="w-4 h-4" />
          <span>Take Picture</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-secondary/5 hover:bg-secondary/10 text-secondary border-secondary/20"
          onClick={handleFileSelect}
          disabled={isUploading}
        >
          <FileText className="w-4 h-4" />
          <span>Upload Files</span>
        </Button>
      </div>

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