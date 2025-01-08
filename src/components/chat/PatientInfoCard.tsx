import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Heart, User, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

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
  const [resolved, setResolved] = useState(isResolved);

  const handleResolve = async () => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_resolved: !resolved })
        .eq('user_id', patientId);

      if (error) throw error;

      setResolved(!resolved);
      toast.success(resolved ? 'Chat marked as unresolved' : 'Chat marked as resolved');
    } catch (error) {
      console.error('Error updating resolved status:', error);
      toast.error('Failed to update chat status');
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 shadow-sm animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Patient Information</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResolve}
              className={`gap-2 ${resolved ? 'text-green-600' : 'text-blue-600'}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {resolved ? 'Resolved' : 'Mark as Resolved'}
            </Button>
          </div>

          <div className="flex flex-col space-y-2 bg-white p-3 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <span className="font-medium">{fullName}</span>
              <span>•</span>
              <span>{age} years</span>
              <span>•</span>
              <span className="capitalize">{gender}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Medical Reports</span>
            </div>
            <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {reportsCount}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-900">Chief Complaint</h3>
            </div>
            <p className="text-sm text-blue-700 bg-white p-2 rounded-md border border-blue-100">
              {complaint || "No complaint recorded"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};