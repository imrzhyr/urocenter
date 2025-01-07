import { MessageSquare, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-4 py-4">
      <div className="relative inline-block">
        <div className="relative">
          <div className="p-4 bg-[#E5DEFF] rounded-full">
            <Stethoscope className="w-12 h-12 text-[#8B5CF6] animate-bounce" />
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Start Your Consultation
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Dr. Ali is ready to help you with any medical concerns
        </p>
        <Button 
          onClick={() => navigate('/chat')}
          className="w-full max-w-[200px] bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all duration-300 shadow-md hover:shadow-lg group"
        >
          <MessageSquare className="mr-2 h-4 w-4 group-hover:animate-bounce" />
          Chat Now
        </Button>
      </div>
    </div>
  );
};