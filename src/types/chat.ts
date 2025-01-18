export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: FileInfo) => void;
  isLoading?: boolean;
}

export interface FileInfo {
  url: string;
  name: string;
  type: string;
  duration?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}