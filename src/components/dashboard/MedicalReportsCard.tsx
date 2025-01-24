import { useState, useEffect } from "react";
import { Eye, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    >
      <Card className={cn(
        "bg-white dark:bg-[#1C1C1E]",
        "shadow-sm",
        "border border-[#C6C6C8] dark:border-[#38383A]",
        "rounded-2xl",
        "overflow-hidden",
        className
      )}>
        <CardHeader className={cn(
          "flex flex-row items-start justify-between",
          "space-y-0 pb-2 pt-6 px-6",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <div className={cn(
            "space-y-1.5",
            isRTL ? "text-right" : "text-left"
          )}>
            <CardTitle className={cn(
              "text-[20px]", // iOS headline
              "font-semibold",
              "text-[#1C1C1E] dark:text-white"
            )}>
              {t('medical_documentation')}
            </CardTitle>
            <CardDescription className={cn(
              "text-[15px]", // iOS subheadline
              "text-[#8E8E93] dark:text-[#98989D]"
            )}>
              {t('manage_medical_records')}
            </CardDescription>
          </div>
          <UploadInformationDialog />
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.2 
            }}
          >
            <div className={cn(
              "flex items-center gap-3",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.3
                }}
                className={cn(
                  "p-3",
                  "bg-[#007AFF]/10 dark:bg-[#0A84FF]/10",
                  "rounded-2xl"
                )}
              >
                <FileText className="h-6 w-6 text-[#007AFF] dark:text-[#0A84FF]" />
              </motion.div>
              <motion.span 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: 0.4
                }}
                className={cn(
                  "text-[22px]", // iOS large title
                  "font-semibold",
                  "text-[#007AFF] dark:text-[#0A84FF]"
                )}
              >
                {medicalReportsCount}
              </motion.span>
            </div>

            <div className={cn(
              "grid grid-cols-2 gap-3",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(2);
                  }
                  setIsViewDialogOpen(true);
                }}
                className={cn(
                  "h-11", // iOS button height
                  "rounded-xl",
                  "text-[17px]", // iOS body
                  "font-normal",
                  "bg-[#F2F2F7] dark:bg-[#2C2C2E]",
                  "hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C]",
                  "active:bg-[#D1D1D6] dark:active:bg-[#48484A]",
                  "border-[#C6C6C8] dark:border-[#38383A]",
                  "text-[#007AFF] dark:text-[#0A84FF]",
                  "transition-colors duration-200",
                  "flex items-center justify-center gap-2",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Eye className="w-[18px] h-[18px]" />
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
                  "h-11", // iOS button height
                  "rounded-xl",
                  "text-[17px]", // iOS body
                  "font-normal",
                  "bg-[#007AFF] dark:bg-[#0A84FF]",
                  "hover:bg-[#0071E3] dark:hover:bg-[#0A84FF]/90",
                  "active:bg-[#0051A2] dark:active:bg-[#0A84FF]/80",
                  "text-white",
                  "transition-colors duration-200",
                  "flex items-center justify-center gap-2",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Plus className="w-[18px] h-[18px]" />
                {t('add_document')}
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isUploadDialogOpen && (
          <UploadDialog 
            key="upload-dialog"
            open={isUploadDialogOpen} 
            onOpenChange={setIsUploadDialogOpen}
            onUploadSuccess={fetchMedicalReports}
          />
        )}

        {isViewDialogOpen && (
          <ViewReportsDialog
            key="view-dialog"
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            userId={profileData?.id}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};