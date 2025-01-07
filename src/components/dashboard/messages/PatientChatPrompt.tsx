import { MessageSquare, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      <div className="relative inline-block mb-4">
        <MessageSquare className="w-16 h-16 text-primary animate-pulse" />
        <Stethoscope className="w-8 h-8 text-blue-500 absolute -right-2 -bottom-2" />
      </div>
      <div className="max-w-sm mx-auto">
        <h3 className="text-xl font-semibold text-primary mb-2">
          Consult with a Doctor
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Get professional medical advice from our experienced healthcare team
        </p>
        <Button 
          onClick={() => navigate('/chat')}
          size="lg"
          className="w-full max-w-[200px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Start Consultation
        </Button>
      </div>
    </div>
  );
};