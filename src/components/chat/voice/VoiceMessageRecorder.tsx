import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VoiceMessageRecorderProps {
  onRecordingComplete: (fileInfo: { url: string; name: string; type: string; duration: number }) => void;
}

export const VoiceMessageRecorder = ({ onRecordingComplete }: VoiceMessageRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Use WebM format for better compatibility
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsUploading(true);
        try {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          audioContextRef.current = new AudioContext();
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
          const audioDuration = Math.round(audioBuffer.duration);

          // Convert file to binary data for upload
          const uint8Array = new Uint8Array(arrayBuffer);
          
          const fileName = `voice-${Date.now()}.webm`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('chat_attachments')
            .upload(fileName, uint8Array, {
              contentType: 'audio/webm',
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('chat_attachments')
            .getPublicUrl(fileName);

          onRecordingComplete({
            url: publicUrl,
            name: fileName,
            type: 'audio/webm',
            duration: audioDuration
          });
          
          toast.success('Voice message recorded successfully');
        } catch (error) {
          console.error('Error processing voice message:', error);
          toast.error('Failed to process voice message');
        } finally {
          setIsUploading(false);
          setDuration(0);
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= 120) { // 2 minute limit
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isUploading ? (
        <Button disabled variant="ghost" size="icon" className="h-10 w-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      ) : isRecording ? (
        <>
          <span className="text-sm text-red-500 animate-pulse">
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </span>
          <Button
            onClick={stopRecording}
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20"
          >
            <Square className="h-5 w-5 text-red-500" />
          </Button>
        </>
      ) : (
        <Button
          onClick={startRecording}
          variant="ghost"
          size="icon"
          className="h-10 w-10"
        >
          <Mic className="h-5 w-5 text-primary" />
        </Button>
      )}
    </div>
  );
};