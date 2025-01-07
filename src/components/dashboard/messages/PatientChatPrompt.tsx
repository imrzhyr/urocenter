import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <MessageSquare className="w-12 h-12 text-primary animate-pulse" />
      <div className="text-center">
        <h3 className="font-medium text-lg">Start Your Consultation</h3>
        <p className="text-sm text-muted-foreground">
          Connect with our healthcare professionals instantly
        </p>
      </div>
      <Button 
        onClick={() => navigate('/chat')}
        className="mt-4"
        size="lg"
      >
        <MessageSquare className="mr-2" />
        Start Consultation
      </Button>
    </div>
  );
};