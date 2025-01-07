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
          label: 'Resolved'
        };
      case 'in_progress':
        return {
          variant: 'secondary' as const,
          label: 'In Progress'
        };
      default:
        return {
          variant: 'destructive' as const,
          label: unreadCount > 0 ? `${unreadCount} Unread` : 'Not Seen'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};