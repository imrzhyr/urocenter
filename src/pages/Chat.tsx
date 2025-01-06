import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Chat = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="text-center space-y-4 max-w-md">
        <MessageSquare className="w-16 h-16 text-blue-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">
          Chat Coming Soon!
        </h1>
        <p className="text-gray-600">
          We're working hard to bring you a new and improved chat experience. 
          Check back soon!
        </p>
        <Button 
          onClick={() => navigate(-1)}
          className="mt-8"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Chat;