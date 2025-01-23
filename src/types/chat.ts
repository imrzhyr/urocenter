import { Message } from "@/types/profile";

export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: FileInfo) => void;
  isLoading?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
}

export interface FileInfo {
  url: string;
  name: string;
  type: string;
  duration?: number;
  urls?: string[];
  names?: string[];
  types?: string[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}