import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateMedicalFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not supported. Please upload JPEG, PNG, PDF, or DOC files.');
  }
};

export const uploadMedicalFile = async (file: File) => {
  try {
    validateMedicalFile(file);

    logger.info('MedicalFileUpload', 'Starting medical file upload', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert file to binary array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    logger.info('MedicalFileUpload', 'Uploading medical file', {
      fileName: filePath,
      contentType: file.type
    });

    const { data, error: uploadError } = await supabase.storage
      .from('medical_reports')
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      logger.error('MedicalFileUpload', 'Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('medical_reports')
      .getPublicUrl(filePath);

    logger.info('MedicalFileUpload', 'Upload successful', {
      url: publicUrl,
      name: file.name,
      type: file.type
    });

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  } catch (error) {
    logger.error('MedicalFileUpload', 'Error in uploadMedicalFile:', error);
    toast.error('Failed to upload medical file');
    throw error;
  }
};