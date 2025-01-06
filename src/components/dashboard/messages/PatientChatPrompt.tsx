import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <MessageSquare className="w-12 h-12 text-blue-500" />
      <div className="text-center">
        <h3 className="font-medium">Start a conversation</h3>
        <p className="text-sm text-muted-foreground">
          Chat with our doctor for medical assistance
        </p>
      </div>
      <Button 
        onClick={() => navigate('/chat')}
        className="mt-4"
      >
        Start Chat
      </Button>
    </div>
  );
};