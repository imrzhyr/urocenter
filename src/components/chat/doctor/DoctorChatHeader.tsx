import { Button } from "@/components/ui/button";
import { Phone, FileText } from "lucide-react";
import { useCall } from "../call/CallProvider";
import { BackButton } from "@/components/BackButton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageViewer } from "../media/ImageViewer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  const { data: messages } = useQuery({
    queryKey: ['messages', patientId],
    queryFn: async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false });
      return data || [];
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

  const isResolved = messages?.some(msg => msg.is_resolved);

  const handleCall = () => {
    initiateCall(patientId, patientName);
  };

  const handleResolve = async () => {
    try {
      // First, update all messages for this user
      const { error: updateError } = await supabase
        .from('messages')
        .update({ is_resolved: !isResolved })
        .eq('user_id', patientId);

      if (updateError) throw updateError;

      // Create a system message to indicate resolution status
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          user_id: patientId,
          content: `Chat ${!isResolved ? 'resolved' : 'unresolved'} by Dr. Ali Kamal`,
          is_from_doctor: true,
          is_read: true,
          status: 'seen',
          is_resolved: !isResolved,
          sender_name: 'System'
        });

      if (insertError) throw insertError;

      toast.success(!isResolved ? "Chat marked as resolved" : "Chat marked as unresolved");
      onRefresh();
    } catch (error) {
      console.error('Error resolving chat:', error);
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
            className={cn(
              "h-8 w-8 transition-colors",
              isResolved 
                ? "text-purple-400 hover:bg-purple-400/20" 
                : "text-red-400 hover:bg-red-400/20"
            )}
            onClick={handleResolve}
          >
            <div className={cn(
              "h-3 w-3 rounded-full",
              isResolved ? "bg-purple-400" : "bg-red-400"
            )} />
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