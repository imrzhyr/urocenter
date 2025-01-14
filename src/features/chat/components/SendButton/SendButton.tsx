import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface SendButtonProps {
  isLoading?: boolean;
}

export const SendButton = ({ isLoading }: SendButtonProps) => {
  return (
    <Button 
      type="submit" 
      size="icon" 
      className="h-10 w-10 flex items-center justify-center"
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingSpinner className="h-5 w-5" />
      ) : (
        <Send className="h-5 w-5" />
      )}
    </Button>
  );
};