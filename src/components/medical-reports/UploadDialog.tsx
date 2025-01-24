import { Camera, Upload, Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, useAnimation } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logger } from '@/utils/logger';
import { uploadMedicalFile } from "@/utils/medicalFileUpload";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export const UploadDialog = ({ open, onOpenChange, onUploadSuccess }: UploadDialogProps) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const autoScrollTimerRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();

  const documentTypes = [
    {
      title: t('diagnostic_imaging'),
      items: [
        t('ultrasound_scans'),
        t('ct_scans'),
        t('mri_reports'),
        t('xrays'),
        t('nuclear_medicine_scans'),
      ],
    },
    {
      title: t('laboratory_results'),
      items: [
        t('psa_test'),
        t('urinalysis'),
        t('blood_test'),
        t('kidney_function'),
        t('hormone_levels'),
      ],
    },
    {
      title: t('medical_documentation'),
      items: [
        t('consultation_notes'),
        t('surgical_reports'),
        t('treatment_plans'),
        t('medication_history'),
        t('discharge_summaries'),
      ],
    },
  ];

  useEffect(() => {
    if (!open) return;

    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const updateMaxScroll = () => {
      setMaxScroll(scrollElement.scrollHeight - scrollElement.clientHeight);
    };

    // Update maxScroll after a short delay to ensure content is rendered
    setTimeout(updateMaxScroll, 100);

    const startAutoScroll = () => {
      if (!isAutoScrolling) return;
      
      const duration = 15000; // 15 seconds for full scroll
      const startTime = Date.now();
      const startScroll = scrollPosition;
      
      const animate = () => {
        if (!isAutoScrolling) return;
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (scrollElement) {
          const newPosition = startScroll + (maxScroll - startScroll) * progress;
          scrollElement.scrollTop = newPosition;
          setScrollPosition(newPosition);
          
          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            // Reset to top after reaching bottom
            autoScrollTimerRef.current = setTimeout(() => {
              scrollElement.scrollTop = 0;
              setScrollPosition(0);
              startAutoScroll();
            }, 1000);
          }
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start auto-scroll after a short delay
    const initTimer = setTimeout(() => {
      startAutoScroll();
    }, 500);

    return () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(initTimer);
    };
  }, [open, isAutoScrolling, maxScroll]);

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const newPosition = scrollElement.scrollTop;
    setScrollPosition(newPosition);

    // Only stop auto-scroll if the scroll was initiated by the user
    if (Math.abs(newPosition - scrollPosition) > 1) {
      setIsAutoScrolling(false);

      // Resume auto-scroll after 2 seconds of no manual scrolling
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }
      autoScrollTimerRef.current = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 2000);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) {
        toast.error(t('sign_in_to_upload'));
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError) {
        logger.error("Profile error", "Failed to fetch profile", profileError);
        toast.error(t('error_accessing_profile'));
        return;
      }

      if (!profileData) {
        toast.error(t('profile_not_found'));
        return;
      }

      const { url, name, type } = await uploadMedicalFile(file);

      const { error: dbError } = await supabase
        .from('medical_reports')
        .insert({
          user_id: profileData.id,
          file_name: name,
          file_path: url.split('/').pop() || '',
          file_type: type,
        });

      if (dbError) {
        logger.error("Database insert error", dbError.message, dbError);
        throw dbError;
      }

      toast.success(t('file_upload_success'));
      onUploadSuccess();
      onOpenChange(false);
    } catch (error) {
      logger.error("Upload error", error instanceof Error ? error.message : 'Unknown error', error);
      toast.error(t('file_upload_failed'));
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        Array.from(files).forEach(handleFileUpload);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('add_medical_report')}</DialogTitle>
          <DialogDescription>
            {t('upload_documents_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="relative">
            <ScrollArea 
              ref={scrollRef}
              onScrollCapture={handleScroll}
              className="h-[300px] pr-4 rounded-md border p-4 overflow-hidden"
            >
              <div className="space-y-6">
                {documentTypes.map((category, index) => (
                  <motion.div 
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
                      {category.title}
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5">
                      {category.items.map((item) => (
                        <li key={item} className="text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isAutoScrolling ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
              <span className="text-xs text-muted-foreground">
                {isAutoScrolling ? t('auto_scrolling') : t('manual_scrolling')}
              </span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary"
              style={{
                width: `${(scrollPosition / (maxScroll || 1)) * 100}%`,
                opacity: isAutoScrolling ? 1 : 0.3
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={handleFileSelect}
              className="flex-1 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Upload className="w-4 h-4" />
              {t('upload_files')}
            </Button>
            <Button
              variant="outline"
              onClick={handleCameraCapture}
              className="flex-1 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
              {t('take_picture')}
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <Info className="w-4 h-4 inline-block mr-2" />
              {t('file_format_info')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};