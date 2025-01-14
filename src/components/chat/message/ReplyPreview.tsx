import { Message } from "@/types/profile";

interface ReplyPreviewProps {
  replyTo: NonNullable<Message['replyTo']>;
}

export const ReplyPreview = ({ replyTo }: ReplyPreviewProps) => {
  const getMessagePreview = (message: { content: string; file_type?: string | null }) => {
    if (!message.content && !message.file_type) return 'Message not available';
    if (message.file_type?.startsWith('audio/')) return '🎵 Voice message';
    if (message.file_type?.startsWith('image/')) return '📷 Photo';
    if (message.file_type?.startsWith('video/')) return '🎥 Video';
    return message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
  };

  return (
    <div className="text-xs bg-black/5 dark:bg-white/5 rounded p-2 mb-2 border-l-2 border-[#0066CC]">
      <div className="opacity-70 flex items-center gap-1">
        <span>↩️ Replying to:</span>
        <span className="font-medium">{replyTo.sender_name || 'Unknown'}</span>
      </div>
      <div className="truncate font-medium mt-1">
        {getMessagePreview(replyTo)}
      </div>
    </div>
  );
};