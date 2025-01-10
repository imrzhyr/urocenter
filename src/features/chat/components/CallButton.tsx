import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CallButtonProps {
  userId: string;
  className?: string;
}

export const CallButton = ({ userId, className }: CallButtonProps) => {
  const navigate = useNavigate();

  const handleCall = () => {
    navigate(`/call/${userId}`);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCall}
      className={className}
    >
      <Phone className="h-5 w-5" />
    </Button>
  );
};