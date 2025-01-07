import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export const PatientChatHeader = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Medical Professional</h3>
            <p className="text-sm text-blue-700">Available for consultation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};