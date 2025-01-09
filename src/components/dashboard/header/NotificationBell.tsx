import { Bell } from "lucide-react";

interface NotificationBellProps {
  hasUnreadMessages: boolean;
}

export const NotificationBell = ({ hasUnreadMessages }: NotificationBellProps) => {
  return (
    <div className="relative">
      <Bell
        className={`w-5 h-5 ${hasUnreadMessages ? 'text-primary' : 'text-muted-foreground'}`}
      />
      {hasUnreadMessages && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
      )}
    </div>
  );
};