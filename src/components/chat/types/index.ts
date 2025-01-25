// Message Types
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name?: string;
  receiver_id: string;
  created_at: string | Date;
  updated_at: string | Date;
  status: 'sent' | 'delivered' | 'seen';
  is_from_doctor: boolean;
  files?: FileInfo[];
  reply_to?: Message;
  // Single file fields (legacy support)
  file_url?: string;
  file_name?: string;
  file_type?: string;
  // Multiple file fields
  file_urls?: string[];
  file_names?: string[];
  file_types?: string[];
  duration?: number;
  seen_at?: string;
  delivered_at?: string;
  typing_users?: string[];
  referenced_message?: {
    id: string;
    content: string;
    sender_name?: string;
    file_type?: string;
  } | null;
  type?: 'message' | 'call';
  call?: Call;
}

// File Types
export interface FileInfo {
  url: string;
  name: string;
  type: string;
  size?: number;
}

// User Types
export interface ChatUser {
  id: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'user';
}

// Call Types
export interface Call {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: 'missed' | 'completed';
  duration?: number;
  created_at: string | Date;
  is_from_doctor: boolean;
  started_at?: string;
  ended_at?: string | null;
}

// Component Props
export interface MessageContainerProps {
  messages: Message[];
  onSendMessage: (content: string, fileInfo?: FileInfo, replyTo?: Message) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading: boolean;
  header: React.ReactNode;
  userId: string;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onMessageSeen?: (messageId: string) => void;
  onReply?: (message: Message) => void;
}

export interface MessageItemProps {
  message: Message;
  currentUserId: string;
  showSenderInfo?: boolean;
  isLastInGroup?: boolean;
  onMessageSeen?: (messageId: string) => void;
  onDragEnd?: (message: Message, info: { offset: { x: number } }) => void;
}

export interface MessageContentProps {
  message: Message;
  fromCurrentUser: boolean;
  onDelete?: (messageId: string) => void;
}

export interface PhotoMessageProps {
  urls: string[];
  fileNames?: string[];
  content?: string;
  timestamp: string;
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
  message: Message;
}

// Chat State
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
} 