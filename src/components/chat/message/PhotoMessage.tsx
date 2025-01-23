import { useState } from "react";
import { Message } from "@/types/profile";
import { format } from "date-fns";
import { MessageStatus } from "../MessageStatus";

export interface PhotoMessageProps {
  message: Message;
}

export const PhotoMessage = ({ message }: PhotoMessageProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="space-y-1">
      <div className="relative">
        <img
          src={message.file_url}
          alt={message.file_name || "Photo"}
          className="max-w-full rounded-lg cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        />
      </div>
      <div className="flex items-center gap-1.5 text-[11px] justify-end text-white/80">
        <span>{format(new Date(message.created_at), 'h:mm a')}</span>
        <MessageStatus message={message} />
      </div>
    </div>
  );
};