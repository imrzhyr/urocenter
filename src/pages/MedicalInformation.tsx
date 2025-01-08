import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileImage, Camera, ScanLine, FileText, FileX, Upload } from "lucide-react";

const MedicalInformation = () => {
  const navigate = useNavigate();

  const documentTypes = [
    {
      title: "Diagnostic Imaging",
      icon: <ScanLine className="w-6 h-6" />,
      description: "Upload CT scans, X-rays, or MRI results",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Lab Reports",
      icon: <FileText className="w-6 h-6" />,
      description: "Blood tests, urinalysis, or other lab results",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Medical Records",
      icon: <FileImage className="w-6 h-6" />,
      description: "Previous medical records or doctor's notes",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Other Documents",
      icon: <FileX className="w-6 h-6" />,
      description: "Any other relevant medical documentation",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
  ];

  const handleNext = () => {
    navigate("/payment");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documentTypes.map((type) => (
          <motion.div
            key={type.title}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border ${type.color} transition-colors cursor-pointer`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              {type.icon}
              <h3 className="font-semibold">{type.title}</h3>
              <p className="text-sm opacity-75">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
          onClick={() => {}}
        >
          <Camera className="w-4 h-4" />
          <span>Take Picture</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center justify-center gap-2 bg-secondary/5 hover:bg-secondary/10 text-secondary border-secondary/20"
          onClick={() => {}}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </Button>
      </div>

      <Button 
        className="w-full"
        onClick={handleNext}
      >
        Continue
      </Button>
    </motion.div>
  );
};

export default MedicalInformation;