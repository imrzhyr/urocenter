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
  const { t, language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const autoScrollTimerRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();
  const isRTL = language === 'ar';

  const documentTypes = [
    {
      title: t('diagnostic_imaging'),
      icon: "🔬",
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
      icon: "🧪",
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
      icon: "📋",
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
      
      const duration = 20000; // 20 seconds for full scroll
      const startTime = Date.now();
      const startScroll = scrollPosition;
      
      const animate = () => {
        if (!isAutoScrolling) return;
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        if (scrollElement) {
          // Add easing for smoother iOS-like scroll
          const easeInOutCubic = (t: number) => 
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          
          const newPosition = startScroll + (maxScroll - startScroll) * easeInOutCubic(progress);
          scrollElement.scrollTop = newPosition;
          setScrollPosition(newPosition);
          
          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            // Pause at bottom before resetting
            autoScrollTimerRef.current = setTimeout(() => {
              // Smooth scroll back to top
              scrollElement.scrollTo({ top: 0, behavior: 'smooth' });
              setScrollPosition(0);
              // Wait for scroll to top to complete before restarting
              setTimeout(startAutoScroll, 1000);
            }, 2000);
          }
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start auto-scroll after a short delay
    const initTimer = setTimeout(() => {
      startAutoScroll();
    }, 1000);

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
        toast.error(t('sign_in_to_upload'), {
          className: cn(
            "bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/80",
            "backdrop-blur-xl",
            "border border-[#C6C6C8] dark:border-[#38383A]",
            "text-[#1C1C1E] dark:text-white",
            "rounded-2xl shadow-lg"
          )
        });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileError) {
        logger.error("Profile error", "Failed to fetch profile", profileError);
        toast.error(t('error_accessing_profile'), {
          className: cn(
            "bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/80",
            "backdrop-blur-xl",
            "border border-[#C6C6C8] dark:border-[#38383A]",
            "text-[#1C1C1E] dark:text-white",
            "rounded-2xl shadow-lg"
          )
        });
        return;
      }

      if (!profileData) {
        toast.error(t('profile_not_found'), {
          className: cn(
            "bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/80",
            "backdrop-blur-xl",
            "border border-[#C6C6C8] dark:border-[#38383A]",
            "text-[#1C1C1E] dark:text-white",
            "rounded-2xl shadow-lg"
          )
        });
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

      toast.success(t('file_upload_success'), {
        className: cn(
          "bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/80",
          "backdrop-blur-xl",
          "border border-[#C6C6C8] dark:border-[#38383A]",
          "text-[#1C1C1E] dark:text-white",
          "rounded-2xl shadow-lg"
        )
      });
      onUploadSuccess();
      onOpenChange(false);
    } catch (error) {
      logger.error("Upload error", error instanceof Error ? error.message : 'Unknown error', error);
      toast.error(t('file_upload_failed'), {
        className: cn(
          "bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/80",
          "backdrop-blur-xl",
          "border border-[#C6C6C8] dark:border-[#38383A]",
          "text-[#1C1C1E] dark:text-white",
          "rounded-2xl shadow-lg"
        )
      });
    }
  };

  const handleCameraCapture = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(2);
    }
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
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(2);
    }
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
      <DialogContent className={cn(
        "bg-[#1A1F2C] dark:bg-[#1C1C1E]",
        "border border-white/[0.08]",
        "backdrop-blur-xl",
        "rounded-2xl",
        "p-6",
        "max-w-lg",
        "mx-auto",
        "shadow-2xl",
        isRTL ? "rtl" : "ltr"
      )}>
        <DialogHeader className="space-y-3">
          <DialogTitle className={cn(
            "text-2xl font-semibold text-white text-center"
          )}>
            {t('add_medical_report')}
          </DialogTitle>
          <DialogDescription className={cn(
            "text-[#8E8E93] dark:text-[#98989D]",
            "text-base text-center"
          )}>
            {t('upload_documents_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCameraCapture}
              className={cn(
                "flex flex-col items-center justify-center",
                "bg-[#34C759]/10 dark:bg-[#32D74B]/10",
                "backdrop-blur-xl",
                "border border-[#34C759]/20 dark:border-[#32D74B]/20",
                "rounded-xl",
                "p-4",
                "space-y-3",
                "group",
                "transition-colors duration-200",
                "hover:bg-[#34C759]/20 dark:hover:bg-[#32D74B]/20"
              )}
            >
              <div className={cn(
                "w-12 h-12",
                "bg-[#34C759]/20 dark:bg-[#32D74B]/20",
                "rounded-xl",
                "flex items-center justify-center",
                "group-hover:bg-[#34C759]/30 dark:group-hover:bg-[#32D74B]/30",
                "transition-colors duration-200"
              )}>
                <Camera className="w-6 h-6 text-[#34C759] dark:text-[#32D74B]" />
              </div>
              <span className="text-[#34C759] dark:text-[#32D74B] text-sm font-medium">
                {t('take_photo')}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFileSelect}
              className={cn(
                "flex flex-col items-center justify-center",
                "bg-[#0A84FF]/10",
                "backdrop-blur-xl",
                "border border-[#0A84FF]/20",
                "rounded-xl",
                "p-4",
                "space-y-3",
                "group",
                "transition-colors duration-200",
                "hover:bg-[#0A84FF]/20"
              )}
            >
              <div className={cn(
                "w-12 h-12",
                "bg-[#0A84FF]/20",
                "rounded-xl",
                "flex items-center justify-center",
                "group-hover:bg-[#0A84FF]/30",
                "transition-colors duration-200"
              )}>
                <Upload className="w-6 h-6 text-[#0A84FF]" />
              </div>
              <span className="text-[#0A84FF] text-sm font-medium">
                {t('choose_file')}
              </span>
            </motion.button>
          </div>

          <div className={cn(
            "bg-[#2C2C2E]/50 dark:bg-[#2C2C2E]/30",
            "backdrop-blur-xl",
            "border border-white/[0.08]",
            "rounded-xl",
            "overflow-hidden"
          )}>
            <h3 className="text-white/90 text-sm font-medium p-4 border-b border-white/[0.08]">
              {t('accepted_document_types')}
            </h3>
            <ScrollArea 
              ref={scrollRef}
              onScrollCapture={handleScroll}
              className="h-[200px] px-4 overflow-hidden ios-momentum-scroll"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className="space-y-4 py-4">
                {documentTypes.map((category, index) => (
                  <motion.div 
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <h4 className="text-white/90 font-medium">
                        {category.title}
                      </h4>
                    </div>
                    <ul className="space-y-2 text-[#8E8E93] dark:text-[#98989D] text-sm">
                      {category.items.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.1) + (i * 0.05) }}
                          className="flex items-center gap-2 pl-8"
                        >
                          <div className="w-1 h-1 rounded-full bg-[#0A84FF]" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};