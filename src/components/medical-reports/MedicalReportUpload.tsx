import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/fileUpload";

export const MedicalReportUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="h-auto py-6 px-4 border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-colors"
        onClick={() => document.getElementById("fileInput")?.click()}
        disabled={isUploading}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-primary">Upload Files</span>
        </div>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          accept="image/*,.pdf,.doc,.docx"
        />
      </Button>

      <Button
        variant="outline"
        className="h-auto py-6 px-4 border-2 border-dashed border-secondary/20 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary/30 transition-colors"
        onClick={() => {
          toast.info("Camera functionality coming soon!");
        }}
        disabled={isUploading}
      >
        <div className="flex flex-col items-center gap-2">
          <Camera className="w-6 h-6 text-secondary" />
          <span className="text-sm font-medium text-secondary">Take Picture</span>
        </div>
      </Button>
    </div>
  );
};