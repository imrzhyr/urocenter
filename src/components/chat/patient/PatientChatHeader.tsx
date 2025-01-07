import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PatientChatHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold">Medical Consultation</h2>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/doctor-profile.jpg" alt="Dr. Ali Kamal" />
              <AvatarFallback>
                <User className="w-6 h-6 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-blue-900">Dr. Ali Kamal</h3>
              <p className="text-sm text-blue-700">Medical Professional</p>
              <p className="text-xs text-blue-600">Available for consultation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};