import { Badge } from "@/components/ui/badge";
import { MessageStatus } from "@/types/messages";

interface MessageStatusBadgeProps {
  status: MessageStatus;
  unreadCount?: number;
}

export const MessageStatusBadge = ({ status, unreadCount = 0 }: MessageStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'resolved':
        return {
          variant: 'default' as const,
          label: 'Resolved',
          className: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'in_progress':
        return {
          variant: 'secondary' as const,
          label: 'In Progress',
          className: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'seen':
        return {
          variant: 'default' as const,
          label: unreadCount > 0 ? `${unreadCount} New` : 'Seen',
          className: 'bg-green-600 hover:bg-green-700'
        };
      case 'not_seen':
        return {
          variant: 'destructive' as const,
          label: unreadCount > 0 ? `${unreadCount} Unread` : 'Not Seen',
          className: ''
        };
      default:
        return {
          variant: 'destructive' as const,
          label: 'Not Seen',
          className: ''
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={`ml-2 ${config.className}`}>
      {config.label}
    </Badge>
  );
};