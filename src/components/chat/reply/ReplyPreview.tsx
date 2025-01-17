import { Message } from "@/types/profile";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ReplyPreviewProps {
  message: Message;
  onCancelReply?: () => void;
}

export const ReplyPreview = ({ message, onCancelReply }: ReplyPreviewProps) => {
  return (
    <div className="flex items-center justify-between bg-muted p-2 rounded-lg">
      <div className="flex-1 truncate">
        <p className="text-sm text-muted-foreground">Replying to message</p>
        <p className="text-sm truncate">{message.content}</p>
      </div>
      {onCancelReply && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onCancelReply}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};