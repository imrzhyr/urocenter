import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, FileText } from "lucide-react";
import { useCall } from "../call/CallProvider";
import { BackButton } from "@/components/BackButton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageViewer } from "../media/ImageViewer";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoctorChatHeaderProps {
  patientId: string;
  patientName: string;
  patientPhone: string | null;
  onRefresh: () => void;
}

export const DoctorChatHeader = ({ 
  patientId,
  patientName,
  patientPhone,
  onRefresh
}: DoctorChatHeaderProps) => {
  const { initiateCall } = useCall();
  const [showInfo, setShowInfo] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: patientInfo } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();
      return profile;
    }
  });

  const { data: chatStatus } = useQuery({
    queryKey: ['chat-status', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('messages')
        .select('is_resolved')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data?.is_resolved || false;
    }
  });

  const { data: medicalReports } = useQuery({
    queryKey: ['medical-reports', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  const handleCall = () => {
    initiateCall(patientId, patientName);
  };

  const handleResolve = async () => {
    try {
      // First, update all messages for this user
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_resolved: !chatStatus })
        .eq('user_id', patientId);

      if (updateError) throw updateError;

      // Add a system message about the resolution status
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          content: '',
          user_id: patientId,
          is_from_doctor: true,
          status: 'seen',
          sender_name: 'System',
          is_resolved: !chatStatus,
          referenced_message: {
            type: 'status',
            content: !chatStatus ? 'Chat marked as resolved' : 'Chat marked as unresolved'
          }
        });

      if (insertError) throw insertError;

      toast.success(!chatStatus ? "Chat marked as resolved" : "Chat marked as unresolved");
      queryClient.invalidateQueries({ queryKey: ['chat-status', patientId] });
      onRefresh();
    } catch (error) {
      console.error('Error updating resolution status:', error);
      toast.error("Failed to update chat status");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <BackButton customRoute="/admin" />
          <div>
            <h3 className="font-medium text-white text-sm">
              {patientName}
            </h3>
            {patientPhone && (
              <p className="text-xs text-white/80">{patientPhone}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={() => setShowInfo(true)}
          >
            <FileText className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={handleCall}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`text-white hover:bg-white/20 h-8 w-8 ${
              chatStatus ? 'bg-purple-500 hover:bg-purple-600' : 'bg-red-500 hover:bg-red-600'
            }`}
            onClick={handleResolve}
          >
            <CheckCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {patientInfo && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Full Name</p>
                  <p className="text-muted-foreground">{patientInfo.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">{patientInfo.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="font-medium">Age</p>
                  <p className="text-muted-foreground">{patientInfo.age || 'Not provided'}</p>
                </div>
                <div>
                  <p className="font-medium">Gender</p>
                  <p className="text-muted-foreground">{patientInfo.gender || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Complaint</p>
                  <p className="text-muted-foreground">{patientInfo.complaint || 'Not provided'}</p>
                </div>
              </div>
            )}

            {medicalReports && medicalReports.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Medical Reports</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {medicalReports.map((report) => {
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
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <ImageViewer
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          url={selectedImage}
        />
      )}
    </>
  );
};