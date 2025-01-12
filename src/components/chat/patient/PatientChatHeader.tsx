import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PatientChatHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 p-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate("/dashboard")}
        className="rounded-full hover:bg-white/20"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Button>
      <div>
        <h3 className="font-medium text-white">Chat with Doctor</h3>
        <p className="text-sm text-white/80">Get medical assistance</p>
      </div>
    </div>
  );
};