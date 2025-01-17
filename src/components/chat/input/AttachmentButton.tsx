import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentButtonProps {
  onClick: () => void;
  onFileSelect: (fileInfo: { url: string; name: string; type: string }) => void;
  isLoading?: boolean;
}

export const AttachmentButton = ({ onClick, onFileSelect, isLoading }: AttachmentButtonProps) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-10 w-10 flex items-center justify-center"
      onClick={onClick}
      disabled={isLoading}
    >
      <Paperclip className="h-5 w-5 text-muted-foreground" />
    </Button>
  );
};