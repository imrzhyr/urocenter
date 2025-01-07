import { MessageSquare, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="relative">
        <MessageSquare className="w-16 h-16 text-primary animate-pulse" />
        <Stethoscope className="w-8 h-8 text-blue-500 absolute -right-2 -bottom-2" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-primary">Consult with a Doctor</h3>
        <p className="text-sm text-muted-foreground max-w-[250px]">
          Get professional medical advice from our experienced healthcare team
        </p>
      </div>
      <Button 
        onClick={() => navigate('/chat')}
        size="lg"
        className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        <MessageSquare className="mr-2 h-5 w-5" />
        Start Consultation
      </Button>
    </div>
  );
};