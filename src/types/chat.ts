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

export interface MessageState {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string, fileInfo?: FileInfo) => Promise<void>;
  fetchMessages: () => Promise<void>;
}