import { Message } from "@/types/profile";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
}

export const ReplyPreview = ({ message, onCancel }: ReplyPreviewProps) => {
  return (
    <div className="px-4 py-2 bg-muted/50 border-t">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">
            Replying to {message.sender_name || 'Unknown'}
          </p>
          <p className="text-sm truncate">{message.content}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};