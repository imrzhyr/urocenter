import { MessageSquare, Stethoscope, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6 py-4">
      <div className="relative inline-block">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative p-4 bg-white rounded-full">
            <UserCircle className="w-16 h-16 text-primary animate-pulse" />
            <Stethoscope className="w-8 h-8 text-blue-500 absolute -right-2 -bottom-2 animate-bounce" />
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Dr. Ali Kamal is Ready to Help
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Start your virtual consultation now
        </p>
        <Button 
          onClick={() => navigate('/chat')}
          className="w-full max-w-[200px] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 shadow-md hover:shadow-lg group"
        >
          <MessageSquare className="mr-2 h-4 w-4 group-hover:animate-bounce" />
          Start Consultation
        </Button>
      </div>
    </div>
  );
};