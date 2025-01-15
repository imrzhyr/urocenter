import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationBell = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 h-9 text-white hover:bg-white/10"
    >
      <Bell className="w-5 h-5" />
    </Button>
  );
};