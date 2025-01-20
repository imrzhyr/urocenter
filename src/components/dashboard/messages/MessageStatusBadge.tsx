import { Badge } from "@/components/ui/badge";
import { MessageStatus } from "@/types/messages";
import { useLanguage } from "@/contexts/LanguageContext";

interface MessageStatusBadgeProps {
  status: MessageStatus;
  unreadCount?: number;
}

export const MessageStatusBadge = ({ status, unreadCount = 0 }: MessageStatusBadgeProps) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (status) {
      case 'resolved':
        return {
          variant: 'default' as const,
          label: 'resolved',
          className: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'in_progress':
        return {
          variant: 'secondary' as const,
          label: 'in_progress',
          className: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'seen':
        return {
          variant: 'default' as const,
          label: 'seen',
          className: 'bg-green-600 hover:bg-green-700'
        };
      case 'not_seen':
        return {
          variant: 'destructive' as const,
          label: unreadCount === 0 ? 'not_seen' : 'new',
          className: unreadCount === 0 ? 'bg-[#FF9500] hover:bg-[#FF9F0A] dark:bg-[#FF9F0A] dark:hover:bg-[#FFB340]' : 'bg-[#FF3B30] hover:bg-[#FF453A] dark:bg-[#FF453A] dark:hover:bg-[#FF6961]'
        };
      default:
        return {
          variant: 'destructive' as const,
          label: 'not_seen',
          className: 'bg-[#FF9500] hover:bg-[#FF9F0A] dark:bg-[#FF9F0A] dark:hover:bg-[#FFB340]'
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