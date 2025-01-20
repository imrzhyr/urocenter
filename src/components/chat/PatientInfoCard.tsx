import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatientBasicInfo } from "./patient-info/PatientBasicInfo";
import { MedicalReportsList } from "./patient-info/MedicalReportsList";
import { PatientActions } from "./patient-info/PatientActions";
import { ChatImagePreview } from "@/features/chat/components/ChatImagePreview/ChatImagePreview";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PatientInfoCardProps {
  complaint: string;
  reportsCount: number;
  age: string;
  gender: string;
  patientId: string;
  isResolved?: boolean;
  phone?: string;
  onClose?: () => void;
}

export const PatientInfoCard = ({
  complaint,
  reportsCount,
  age,
  gender,
  patientId,
  isResolved = false,
  phone,
  onClose,
}: PatientInfoCardProps) => {
  const [isResolvedState, setIsResolvedState] = useState(isResolved);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const handleResolveToggle = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_resolved: !isResolvedState })
        .eq('user_id', patientId);

      if (error) throw error;

      setIsResolvedState(!isResolvedState);
      toast.success(isResolvedState ? t('chat_unresolved') : t('chat_resolved'));
    } catch (error) {
      console.error('Error updating resolution status:', error);
      toast.error(t('failed_resolve'));
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error(t('failed_load_reports'));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute inset-x-0 top-0 max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <Card className="bg-[#f2f2f7] dark:bg-[#1c1c1e] border-0 rounded-b-xl shadow-lg">
          <CardHeader className="relative pb-2 pt-4">
            <CardTitle className="text-[22px] font-semibold text-[#1c1c1e] dark:text-white flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('patient_information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PatientBasicInfo
              age={age}
              gender={gender}
              phone={phone}
            />

            <Tabs 
              defaultValue="complaint" 
              className="w-full"
              onValueChange={(value) => {
                if (value === "reports") {
                  fetchReports();
                }
              }}
            >
              <TabsList className="grid w-full grid-cols-2 h-[36px] bg-[#e5e5ea] dark:bg-[#2c2c2e] p-1 rounded-lg">
                <TabsTrigger 
                  value="complaint"
                  className={cn(
                    "text-[15px] rounded-md",
                    "data-[state=active]:bg-white dark:data-[state=active]:bg-[#3a3a3c]",
                    "data-[state=active]:text-[#1c1c1e] dark:data-[state=active]:text-white",
                    "data-[state=inactive]:text-[#8e8e93] dark:data-[state=inactive]:text-[#98989d]",
                    "transition-all duration-200"
                  )}
                >
                  {t('medical_complaint')}
                </TabsTrigger>
                <TabsTrigger 
                  value="reports"
                  className={cn(
                    "text-[15px] rounded-md",
                    "data-[state=active]:bg-white dark:data-[state=active]:bg-[#3a3a3c]",
                    "data-[state=active]:text-[#1c1c1e] dark:data-[state=active]:text-white",
                    "data-[state=inactive]:text-[#8e8e93] dark:data-[state=inactive]:text-[#98989d]",
                    "transition-all duration-200"
                  )}
                >
                  {t('medical_reports')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="complaint" className="mt-4">
                <div className="bg-white dark:bg-[#2c2c2e] rounded-lg p-4">
                  <h3 className="text-[17px] text-[#1c1c1e] dark:text-white mb-2">{t('medical_complaint')}</h3>
                  <p className="text-[15px] text-[#8e8e93] dark:text-[#98989d]">{complaint || t('no_complaint')}</p>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <div className="bg-white dark:bg-[#2c2c2e] rounded-lg p-4">
                  <MedicalReportsList
                    reports={reports}
                    onImageSelect={setSelectedImage}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <PatientActions
              isResolved={isResolvedState}
              onToggleResolved={handleResolveToggle}
            />

            {selectedImage && (
              <ChatImagePreview
                url={selectedImage}
                onClose={() => setSelectedImage(null)}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};