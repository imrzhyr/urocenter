import { User, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DoctorChatHeaderProps {
  patientName?: string;
  patientPhone?: string;
}

export const DoctorChatHeader = ({ patientName, patientPhone }: DoctorChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate("/admin")}
        className="rounded-full hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      <Avatar className="h-10 w-10">
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-medium text-white">{patientName || "Unknown Patient"}</h3>
        <p className="text-sm text-white/80">{patientPhone || "No phone number"}</p>
      </div>
    </div>
  );
};