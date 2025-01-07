import { MessageSquare, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-4 py-2">
      <div className="relative inline-block mb-2">
        <MessageSquare className="w-12 h-12 text-primary animate-pulse" />
        <Stethoscope className="w-6 h-6 text-blue-500 absolute -right-1 -bottom-1" />
      </div>
      <div className="max-w-xs mx-auto">
        <h3 className="text-sm font-medium text-gray-700 mb-1">
          Connect with a Doctor
        </h3>
        <Button 
          onClick={() => navigate('/chat')}
          size="sm"
          className="w-full max-w-[160px] bg-primary hover:bg-primary/90 transition-colors"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Start Chat
        </Button>
      </div>
    </div>
  );
};