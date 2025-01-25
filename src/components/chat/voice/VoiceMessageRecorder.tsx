import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/fileUpload";
import { cn } from "@/lib/utils";

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

          const file = new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: 'audio/webm' });

          const uploadedFile = await uploadFile(file);
          onRecordingComplete({
            ...uploadedFile,
            duration: audioDuration
          });
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
        <div className="voice-message group">
          <div className="voice-message-play">
            <Loader2 className="h-4 w-4 animate-spin text-white/80" />
          </div>
          <div className="voice-message-waveform">
            <div className="voice-message-waveform-bg voice-message-loading" />
          </div>
          <div className="voice-message-duration text-white/60">
            Processing...
          </div>
        </div>
      ) : isRecording ? (
        <div className="voice-recording">
          <div className="voice-recording-indicator" />
          <span className="voice-recording-time">
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </span>
          <Button
            onClick={stopRecording}
            variant="ghost"
            size="icon"
            className="voice-recording-cancel"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={startRecording}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8",
            "rounded-xl",
            "bg-white/[0.08]",
            "text-white/90",
            "hover:bg-white/[0.12] active:bg-white/[0.16]",
            "transition-all duration-200",
            "backdrop-blur-sm"
          )}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};