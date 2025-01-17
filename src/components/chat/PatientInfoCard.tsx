import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageViewer } from "../chat/media/ImageViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatientBasicInfo } from "./patient-info/PatientBasicInfo";
import { MedicalReportsList } from "./patient-info/MedicalReportsList";
import { PatientActions } from "./patient-info/PatientActions";
import { ViewReportsDialog } from "../medical-reports/ViewReportsDialog";

interface PatientInfoCardProps {
  complaint: string;
  reportsCount: number;
  fullName: string;
  age: string;
  gender: string;
  patientId: string;
  isResolved?: boolean;
  phone?: string;
  createdAt?: string;
}

export const PatientInfoCard = ({
  complaint,
  reportsCount,
  fullName,
  age,
  gender,
  patientId,
  isResolved = false,
  phone,
  createdAt
}: PatientInfoCardProps) => {
  const [isResolvedState, setIsResolvedState] = useState(isResolved);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showReports, setShowReports] = useState(false);
  const { t } = useLanguage();

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
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <User className="h-5 w-5" />
          {t('patient_information')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <PatientBasicInfo
          fullName={fullName}
          age={age}
          gender={gender}
          phone={phone}
          createdAt={createdAt}
        />

        <Tabs defaultValue="complaint" className="w-full" onValueChange={(value) => {
          if (value === "reports") {
            fetchReports();
          }
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="complaint">{t('medical_complaint')}</TabsTrigger>
            <TabsTrigger value="reports">{t('medical_reports')}</TabsTrigger>
          </TabsList>
          <TabsContent value="complaint" className="space-y-1">
            <h3 className="font-medium">{t('medical_complaint')}</h3>
            <p className="text-sm text-muted-foreground">{complaint || t('no_complaint')}</p>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <MedicalReportsList
              reports={reports}
              onImageSelect={setSelectedImage}
            />
          </TabsContent>
        </Tabs>

        <PatientActions
          isResolved={isResolvedState}
          reportsCount={reportsCount}
          onToggleResolved={handleResolveToggle}
          onViewReports={() => {
            setShowReports(true);
            fetchReports();
          }}
        />

        <ViewReportsDialog 
          open={showReports} 
          onOpenChange={setShowReports}
          userId={patientId}
        />

        {selectedImage && (
          <ImageViewer
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
            url={selectedImage}
          />
        )}
      </CardContent>
    </Card>
  );
};