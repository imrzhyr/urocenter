import { Message } from "@/types/profile";

interface VideoMessageProps {
  message: Message;
}

export const VideoMessage = ({ message }: VideoMessageProps) => {
  if (!message.file_url) return null;

  return (
    <video 
      src={message.file_url} 
      controls 
      className="max-w-full rounded-lg"
    />
  );
};