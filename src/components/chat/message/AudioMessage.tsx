import { Message } from "@/types/profile";
import { AudioPlayer } from "../audio/AudioPlayer";

interface AudioMessageProps {
  message: Message;
}

export const AudioMessage = ({ message }: AudioMessageProps) => {
  if (!message.file_url) return null;

  return (
    <AudioPlayer
      audioUrl={message.file_url}
      messageId={message.id}
      duration={message.duration}
    />
  );
};