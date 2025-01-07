import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";

export const PatientChatHeader = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

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

      <div className="flex items-center gap-4 p-4 bg-white border border-blue-100 rounded-lg shadow-sm">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/lovable-uploads/eec1d792-9f5f-43ca-9c3c-ff7833f986ff.png" alt="Dr. Ali Kamal" />
          <AvatarFallback>
            <User className="w-6 h-6 text-blue-600" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-blue-900">Dr. Ali Kamal</h3>
        </div>
      </div>

      {profile && (
        <Card className="bg-white border border-blue-100 shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Patient Name:</span>
                <span className="font-medium">{profile.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Age:</span>
                <span>{profile.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Gender:</span>
                <span>{profile.gender}</span>
              </div>
              {profile.complaint && (
                <div className="flex justify-between">
                  <span className="text-blue-700">Chief Complaint:</span>
                  <span>{profile.complaint}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};