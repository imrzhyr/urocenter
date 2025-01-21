import { useState, useRef, useEffect } from 'react';
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const audioContextRef = useRef<AudioContext>();

  // Check for microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setHasPermission(result.state === 'granted');
      
      // Listen for permission changes
      result.addEventListener('change', () => {
        setHasPermission(result.state === 'granted');
      });
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setHasPermission(null); // Unknown state
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          toast.error('Please allow microphone access to send voice messages');
        } else if (error.name === 'NotFoundError') {
          toast.error('No microphone found. Please connect a microphone and try again');
        } else {
          toast.error('Unable to access microphone');
        }
      }
      setHasPermission(false);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      // If we don't have permission yet, request it
      if (!hasPermission) {
        const granted = await requestMicrophonePermission();
        if (!granted) return;
      }

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
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          toast.error('Please allow microphone access to send voice messages');
        } else if (error.name === 'NotFoundError') {
          toast.error('No microphone found. Please connect a microphone and try again');
        } else {
          toast.error('Unable to access microphone');
        }
      } else {
        toast.error('Failed to start recording');
      }
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
        <Button disabled variant="ghost" size="icon" className="h-8 w-8">
          <Loader2 className="h-4 w-4 animate-spin" />
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
            className="h-8 w-8 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20"
          >
            <Square className="h-4 w-4 text-red-500" />
          </Button>
        </>
      ) : (
        <Button
          onClick={startRecording}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};