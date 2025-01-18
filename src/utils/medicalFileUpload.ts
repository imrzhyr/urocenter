import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from '@/utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateMedicalFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  if (!file.type.match(/^image\/jpeg$/)) {
    throw new Error('Only JPEG files are supported');
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

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    logger.info('MedicalFileUpload', 'Uploading medical file', {
      fileName,
      contentType: file.type
    });

    const formData = new FormData();
    formData.append('file', file);

    const { data, error } = await supabase.storage
      .from('medical_attachments')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      logger.error('MedicalFileUpload', 'Upload error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('medical_attachments')
      .getPublicUrl(fileName);

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