import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User } from "lucide-react";
import { ViewReportsDialog } from "../medical-reports/ViewReportsDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ImageViewer } from "../chat/media/ImageViewer";

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

  const handleResolveToggle = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_resolved: !isResolvedState })
        .eq('user_id', patientId);

      if (error) throw error;

      setIsResolvedState(!isResolvedState);
      toast.success(isResolvedState ? "Chat marked as unresolved" : "Chat marked as resolved");
    } catch (error) {
      console.error('Error updating resolution status:', error);
      toast.error("Failed to update chat status");
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
            <h3 className="font-medium">Full Name</h3>
            <p>{fullName || "Not provided"}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Age</h3>
            <p>{age || "Not provided"}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Gender</h3>
            <p>{gender || "Not provided"}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Phone</h3>
            <p>{phone || "Not provided"}</p>
          </div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Member Since</h3>
            <p>{createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : "Not available"}</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">Complaint</h3>
            <p className="text-sm text-muted-foreground">{complaint || "No complaint provided"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Medical Reports ({reportsCount})</h3>
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
        </div>

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
            View Medical Reports ({reportsCount})
          </Button>
          <Button
            variant={isResolvedState ? "destructive" : "default"}
            className="w-full"
            onClick={handleResolveToggle}
          >
            {isResolvedState ? "Mark as Unresolved" : "Mark as Resolved"}
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