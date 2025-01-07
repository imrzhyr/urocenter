import { Card, CardContent } from "@/components/ui/card";
import { User, Clock } from "lucide-react";
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

      <Card className="bg-white border border-blue-100 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/doctor-profile.jpg" alt="Dr. Ali Kamal" />
              <AvatarFallback>
                <User className="w-6 h-6 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">Dr. Ali Kamal</h3>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Clock className="w-4 h-4" />
                <span>25 years of experience</span>
              </div>
              <p className="text-xs text-blue-600">Available for consultation</p>
            </div>
          </div>

          {profile && (
            <div className="mt-4 pt-4 border-t border-blue-50">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};