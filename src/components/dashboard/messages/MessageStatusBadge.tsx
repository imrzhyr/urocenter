import { Badge } from "@/components/ui/badge";

interface MessageStatusBadgeProps {
  status: 'not_seen' | 'in_progress' | 'resolved';
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
    <Badge variant={config.variant} className="ml-2">
      {config.label}
    </Badge>
  );
};