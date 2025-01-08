import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, User } from "lucide-react";
import { ViewReportsDialog } from "../medical-reports/ViewReportsDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatientInfoCardProps {
  complaint: string;
  reportsCount: number;
  fullName: string;
  age: string;
  gender: string;
  patientId: string;
  isResolved?: boolean;
}

export const PatientInfoCard = ({
  complaint,
  reportsCount,
  fullName,
  age,
  gender,
  patientId,
  isResolved = false
}: PatientInfoCardProps) => {
  const [showReports, setShowReports] = useState(false);
  const [isResolvedState, setIsResolvedState] = useState(isResolved);

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
          <div className="space-y-1">
            <h3 className="font-medium">Complaint</h3>
            <p className="text-sm text-muted-foreground">{complaint || "No complaint provided"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setShowReports(true)}
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
      </CardContent>
    </Card>
  );
};