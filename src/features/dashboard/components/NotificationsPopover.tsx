import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

export const NotificationsPopover = () => {
  const { t } = useLanguage();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">{t('notifications')}</h4>
        </div>
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {/* We'll implement notifications later */}
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('no_notifications')}
            </p>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};