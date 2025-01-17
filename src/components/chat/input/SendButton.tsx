import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface SendButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const SendButton = ({ onClick, isLoading, disabled }: SendButtonProps) => {
  return (
    <Button 
      type="submit" 
      size="icon" 
      className="h-10 w-10 flex items-center justify-center"
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <LoadingSpinner className="h-5 w-5" />
      ) : (
        <Send className="h-5 w-5" />
      )}
    </Button>
  );
};