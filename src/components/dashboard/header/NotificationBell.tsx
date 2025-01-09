import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationBell = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10 p-2 hover:bg-gray-100 rounded-full"
    >
      <Bell className="w-5 h-5 text-primary" />
    </Button>
  );
};