import { useState, useEffect } from "react";
import { Eye, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UploadDialog } from "@/components/medical-reports/UploadDialog";
import { ViewReportsDialog } from "@/components/medical-reports/ViewReportsDialog";
import { UploadInformationDialog } from "@/components/medical-reports/UploadInformationDialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface MedicalReportsCardProps {
  className?: string;
}

export const MedicalReportsCard = ({ className }: MedicalReportsCardProps) => {
  const { t, language } = useLanguage();
  const [medicalReportsCount, setMedicalReportsCount] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState<{ id: string } | null>(null);
  const isRTL = language === 'ar';

  const fetchMedicalReports = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      console.log('Fetching reports for phone:', userPhone);
      
      if (!userPhone) {
        toast.error(t('sign_in_to_access_records'), {
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', userPhone)
        .maybeSingle();

      console.log('Profile data:', profile);
      if (profileError) console.error('Profile fetch error:', profileError);

      if (!profile) {
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

      setProfileData(profile);

      const { data: reports, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', profile.id);

      console.log('Medical reports:', reports);
      if (error) console.error('Reports fetch error:', error);

      if (error) throw error;

      setMedicalReportsCount(reports?.length || 0);
    } catch (error) {
      console.error('Error in fetchMedicalReports:', error);
      toast.error(t('unable_to_fetch_records'), {
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

  useEffect(() => {
    fetchMedicalReports();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "bg-[#1A1F2C] dark:bg-[#1C1C1E]",
        "rounded-2xl",
        "overflow-hidden",
        "p-6",
        "border border-white/[0.08]",
        "backdrop-blur-xl",
        className
      )}
    >
      <div className="space-y-6">
        <div className={cn(
          "flex items-start justify-between",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <div className={cn(
            "space-y-2",
            isRTL ? "text-right" : "text-left"
          )}>
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-semibold text-white"
            >
              {t('medical_documentation')}
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#8E8E93] dark:text-[#98989D] text-base"
            >
              {t('manage_medical_records')}
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <UploadInformationDialog />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "flex flex-col w-full",
            "bg-[#2C2C2E]/50 dark:bg-[#2C2C2E]/30",
            "backdrop-blur-xl",
            "border border-white/[0.08]",
            "rounded-xl",
            "p-4"
          )}
        >
          <div className={cn(
            "flex items-center gap-4",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "w-12 h-12",
              "bg-[#0A84FF]/10",
              "rounded-xl",
              "flex items-center justify-center"
            )}>
              <FileText className="w-6 h-6 text-[#0A84FF]" />
            </div>
            <div className="flex flex-col">
              <span className="text-white/90 text-sm font-medium">
                {t('total_reports')}
              </span>
              <span className="text-2xl font-semibold text-[#0A84FF]">
                {medicalReportsCount}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cn(
            "grid grid-cols-2 gap-3",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Button 
            variant="outline" 
            onClick={() => {
              if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(2);
              }
              setIsViewDialogOpen(true);
            }}
            className={cn(
              "h-12",
              "rounded-xl",
              "text-base font-medium",
              "bg-[#2C2C2E]/50 dark:bg-[#2C2C2E]/30",
              "hover:bg-[#2C2C2E]/70 dark:hover:bg-[#2C2C2E]/50",
              "active:bg-[#2C2C2E]/90 dark:active:bg-[#2C2C2E]/70",
              "border border-white/[0.08]",
              "text-white",
              "backdrop-blur-xl",
              "transition-all duration-200",
              "flex items-center justify-center gap-2",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Eye className="w-5 h-5" />
            {t('view_records')}
          </Button>
          <Button 
            variant="default"
            onClick={() => {
              if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(2);
              }
              setIsUploadDialogOpen(true);
            }}
            className={cn(
              "h-12",
              "rounded-xl",
              "text-base font-medium",
              "bg-[#0A84FF]",
              "hover:bg-[#0A84FF]/90",
              "active:bg-[#0A84FF]/80",
              "text-white",
              "transition-all duration-200",
              "flex items-center justify-center gap-2",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Plus className="w-5 h-5" />
            {t('upload_report')}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isUploadDialogOpen && (
          <UploadDialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
            onUploadSuccess={fetchMedicalReports}
          />
        )}
        {isViewDialogOpen && (
          <ViewReportsDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};