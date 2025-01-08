import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/fileUpload";

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
  const startTimeRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setIsUploading(true);
        try {
          const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: 'audio/webm' });
          const uploadedFile = await uploadFile(file);
          const recordingDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
          onRecordingComplete({
            url: uploadedFile.url,
            name: uploadedFile.name,
            type: uploadedFile.type,
            duration: recordingDuration
          });
        } catch (error) {
          console.error('Error uploading voice message:', error);
          toast.error('Failed to upload voice message');
        } finally {
          setIsUploading(false);
          setDuration(0);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= 60) {
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
            className="h-10 w-10 bg-red-50 hover:bg-red-100"
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