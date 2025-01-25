export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at?: string;
  seen?: boolean;
  file_info?: FileInfo;
  file_url?: string;
  file_type?: string;
  file_name?: string;
  duration?: number;
  files?: FileInfo[];
}

export interface FileInfo {
  url: string;
  type: string;
  name: string;
  size?: number;
  duration?: number;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  onMessageSeen?: (messageId: string) => void;
  onReply?: (message: Message) => void;
  showSenderInfo?: boolean;
}

export interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
}

export interface PhotoMessageProps {
  urls: string[];
  fileNames?: string[];
  content?: string;
  timestamp: string | Date;
  fromCurrentUser: boolean;
  showStatus?: boolean;
}

export interface AudioPlayerProps {
  audioUrl: string;
  messageId: string;
  duration?: number;
  isUserMessage: boolean;
}

export interface MessageInputProps {
  onSendMessage: (content: string, fileInfo?: FileInfo) => void;
  isLoading?: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
  onTyping?: (isTyping: boolean) => void;
}

export interface MessageStatusProps {
  message: Pick<Message, 'created_at'> & {
    status?: 'sent' | 'delivered' | 'seen';
  };
} 