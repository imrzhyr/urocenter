import { Card, CardContent } from "@/components/ui/card";
import { FileText, Heart } from "lucide-react";

interface PatientInfoCardProps {
  complaint: string;
  reportsCount: number;
}

export const PatientInfoCard = ({ complaint, reportsCount }: PatientInfoCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 shadow-sm animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
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