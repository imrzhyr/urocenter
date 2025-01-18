import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://byjyyshxviieqkymavnh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5anl5c2h4dmlpZXFreW1hdm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMjQ1ODMsImV4cCI6MjA1MTYwMDU4M30.iP1Tlz7tnwO9GDY4oW12fN8IwImcjkoLpBhdsCq1VwM";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'Content-Type': 'application/json', // This is for general requests, not file uploads
      },
    },
  }
);

// Function to get MIME type based on file extension
function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'webm': return 'video/webm';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'ogg': return 'audio/ogg';
    // Add more cases as needed
    default: return 'application/octet-stream'; // Default MIME type
  }
}

// Example function to upload a file
export async function uploadFile(file: File) {
  const mimeType = getMimeType(file.name);
  const { data, error } = await supabase.storage
    .from('your-bucket-name')
    .upload(`public/${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: mimeType, // Set the appropriate MIME type for the file
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return data;
}