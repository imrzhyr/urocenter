import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileImage, Camera, ScanLine, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/fileUpload";

const MedicalInformation = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

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
      await uploadFile(file);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 p-4"
    >
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
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </Button>
      </div>

      <Button 
        className="w-full"
        onClick={() => navigate("/payment")}
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default MedicalInformation;