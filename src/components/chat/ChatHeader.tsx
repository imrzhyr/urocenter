import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  onBack: () => void;
}

export const ChatHeader = ({ onBack }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
          className="mr-2 hover:bg-blue-50"
        >
          <ArrowLeft className="w-5 h-5 text-blue-700" />
        </Button>
        <Avatar className="h-12 w-12 border-2 border-blue-100">
          <AvatarImage 
            src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png" 
            alt="Dr. Ali Kamal" 
          />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-lg text-blue-900">Dr. Ali Kamal</h2>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <p className="text-sm text-blue-600">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};