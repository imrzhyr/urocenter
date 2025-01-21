import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useFileUploadHandler = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const navigate = useNavigate();

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

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${profileData.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('medical_reports')
        .upload(fileName, uint8Array, {
          contentType: file.type,
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
      toast.success(`File uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadCount,
    handleFileUpload
  };
};