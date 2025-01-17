import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User } from "lucide-react";
import { ViewReportsDialog } from "../medical-reports/ViewReportsDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ImageViewer } from "../chat/media/ImageViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [showReports, setShowReports] = useState(false);
  const [isResolvedState, setIsResolvedState] = useState(isResolved);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
      toast.error("Failed to load medical reports");
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('full_name')}</h3>
            <p>{fullName || t('not_provided')}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('age')}</h3>
            <p>{age || t('not_provided')}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('gender')}</h3>
            <p>{gender || t('not_provided')}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('phone')}</h3>
            <p>{phone || t('not_provided')}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('member_since')}</h3>
            <p>{createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : t('not_provided')}</p>
          </div>
        </div>

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
            {reports.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {reports.map((report) => {
                  const isImage = report.file_type?.startsWith('image/');
                  const fileUrl = supabase.storage
                    .from('medical_reports')
                    .getPublicUrl(report.file_path).data.publicUrl;

                  if (isImage) {
                    return (
                      <div
                        key={report.id}
                        className="relative cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => setSelectedImage(fileUrl)}
                      >
                        <img
                          src={fileUrl}
                          alt={report.file_name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs text-center px-2">
                            {report.file_name}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={report.id}
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate">{report.file_name}</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('no_reports')}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => {
              setShowReports(true);
              fetchReports();
            }}
          >
            <FileText className="h-4 w-4" />
            {t('view_reports')} ({reportsCount})
          </Button>
          <Button
            variant={isResolvedState ? "destructive" : "default"}
            className="w-full"
            onClick={handleResolveToggle}
          >
            {isResolvedState ? t('mark_unresolved') : t('mark_resolved')}
          </Button>
        </div>

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