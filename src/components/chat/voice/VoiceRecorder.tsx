import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VoiceRecorderProps {
  onRecordingComplete: (audioUrl: string, duration: number) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        
        try {
          // Upload to Supabase
          const fileName = `${crypto.randomUUID()}.webm`;
          const { data, error: uploadError } = await supabase.storage
            .from('chat_attachments')
            .upload(fileName, audioBlob, {
              contentType: 'audio/webm',
              upsert: false
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error('Failed to upload voice message');
            return;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('chat_attachments')
            .getPublicUrl(fileName);

          onRecordingComplete(publicUrl, duration);
          setDuration(0);
        } catch (error) {
          console.error('Error processing recording:', error);
          toast.error('Failed to process voice message');
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start duration timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setDuration(seconds);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={toggleRecording}
    >
      {isRecording ? (
        <Square className="h-5 w-5 text-red-500" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};