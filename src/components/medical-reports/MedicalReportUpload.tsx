import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const MedicalReportUpload = () => {
  const [medicalReports, setMedicalReports] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (medicalReports.length >= 10) {
      toast({
        title: "Maximum limit reached",
        description: "You can only upload up to 10 medical reports",
        variant: "destructive",
      });
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const fileName = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('medical_reports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('medical_reports')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_type: file.type,
        });

      if (dbError) throw dbError;

      setMedicalReports([...medicalReports, file]);
      toast({
        title: "File uploaded successfully",
        description: file.name,
      });
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setMedicalReports(medicalReports.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <Label>Medical Reports</Label>
      <div className="grid grid-cols-2 gap-2">
        {medicalReports.map((file, index) => (
          <div key={index} className="relative bg-muted p-2 rounded-lg">
            <button
              onClick={() => removeFile(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs truncate">{file.name}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
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
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            toast({
              title: "Camera capture",
              description: "This feature is coming soon",
            });
          }}
        >
          <Camera className="w-4 h-4 mr-2" />
          Camera
        </Button>
      </div>
    </div>
  );
};