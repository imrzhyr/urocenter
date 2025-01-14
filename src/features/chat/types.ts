import { Message } from "@/types/profile";

export interface ChatMessage extends Message {
  isLoading?: boolean;
  error?: string;
}

export interface FileInfo {
  url: string;
  name: string;
  type: string;
  duration?: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}