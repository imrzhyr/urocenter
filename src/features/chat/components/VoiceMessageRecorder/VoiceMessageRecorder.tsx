import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/utils/fileUpload";
import { logger } from "@/utils/logger";

interface VoiceMessageRecorderProps {
  userId: string;
  onRecordingComplete?: () => void;
}

export const VoiceMessageRecorder = ({ userId, onRecordingComplete }: VoiceMessageRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      // Try different audio formats in order of preference
      const mimeTypes = [
        'audio/mp3',
        'audio/mpeg',
        'audio/webm',
        'audio/wav'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      if (!selectedMimeType) {
        throw new Error('No supported audio format found');
      }

      logger.info('VoiceRecorder', 'Starting recording with format', {
        selectedFormat: selectedMimeType,
        browser: navigator.userAgent
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000 // 128kbps for good quality
      });
      
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: selectedMimeType });
        
        setIsUploading(true);
        
        try {
          const fileExtension = selectedMimeType.split('/')[1];
          const file = new File([audioBlob], `voice-message-${Date.now()}.${fileExtension}`, { 
            type: selectedMimeType
          });
          
          logger.info('VoiceRecorder', 'Recording completed', {
            duration: Math.round((Date.now() - startTimeRef.current) / 1000),
            fileSize: file.size,
            mimeType: file.type
          });
          
          const fileInfo = await uploadFile(file);
          const audioDuration = Math.round((Date.now() - startTimeRef.current) / 1000);
          
          onRecordingComplete?.();
        } catch (error) {
          logger.error('VoiceRecorder', 'Failed to upload voice message', error instanceof Error ? error : new Error('Unknown error'));
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
      logger.error('VoiceRecorder', 'Failed to start recording', error instanceof Error ? error : new Error('Failed to access microphone'));
      toast.error('Failed to access microphone. Please check your browser permissions.');
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
            className="h-10 w-10 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
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