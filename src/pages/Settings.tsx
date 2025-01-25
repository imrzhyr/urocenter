import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Bell, HelpCircle, Info, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userPhone');
    navigate('/', { replace: true });
  };

  const settingsSections = [
    {
      icon: HelpCircle,
      title: t('help'),
      onClick: () => {}
    },
    {
      icon: Info,
      title: t('about'),
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container max-w-4xl mx-auto p-4">
        {/* Header */}
        <header className="w-full mb-6">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-semibold">{t('settings')}</h1>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">{t('language')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>{t('select_language')}</span>
              </div>
              <LanguageSelector />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">{t('notifications')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>{t('push_notifications')}</span>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>

          <div className="space-y-2">
            {settingsSections.map((section) => (
              <Card
                key={section.title}
                className={cn(
                  "p-4 cursor-pointer",
                  "bg-white dark:bg-[hsl(217,33%,18%)]",
                  "hover:bg-gray-50 dark:hover:bg-[hsl(217,33%,22%)]",
                  "border-[#E5E5EA] dark:border-[#38383A]"
                )}
                onClick={section.onClick}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={() => setShowLogoutDialog(true)}
            className={cn(
              "w-full h-11",
              "rounded-xl",
              "text-[17px]",
              "font-normal",
              "bg-[#FF3B30] dark:bg-[#FF453A]",
              "hover:bg-[#FF3B30]/90 dark:hover:bg-[#FF453A]/90",
              "active:bg-[#FF3B30]/80 dark:active:bg-[#FF453A]/80",
              "text-white",
              "transition-colors duration-200",
              "flex items-center gap-2"
            )}
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showLogoutDialog && (
          <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialogContent className={cn(
              "bg-[#F2F2F7]/95 dark:bg-[#1C1C1E]/95",
              "backdrop-blur-xl",
              "border border-[#C6C6C8] dark:border-[#38383A]",
              "rounded-2xl",
              "shadow-xl",
              "p-0",
              "max-w-[320px]",
              isRTL ? "rtl" : "ltr"
            )}>
              <AlertDialogHeader className="p-6 pb-4">
                <AlertDialogTitle className={cn(
                  "text-[17px]",
                  "font-semibold",
                  "text-[#1C1C1E] dark:text-white",
                  "text-center",
                  "mb-1"
                )}>
                  {t('confirm_logout')}
                </AlertDialogTitle>
                <AlertDialogDescription className={cn(
                  "text-[13px]",
                  "text-[#8E8E93] dark:text-[#98989D]",
                  "text-center"
                )}>
                  {t('logout_confirmation_message')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="p-4 pt-0">
                <AlertDialogFooter className="flex flex-row gap-2">
                  <AlertDialogCancel className={cn(
                    "flex-1",
                    "h-11",
                    "rounded-xl",
                    "text-[17px]",
                    "font-normal",
                    "bg-[#F2F2F7] dark:bg-[#2C2C2E]",
                    "hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C]",
                    "active:bg-[#D1D1D6] dark:active:bg-[#48484A]",
                    "border-[#C6C6C8] dark:border-[#38383A]",
                    "text-[#007AFF] dark:text-[#0A84FF]",
                    "transition-colors duration-200",
                    "m-0"
                  )}>
                    {t('cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className={cn(
                      "flex-1",
                      "h-11",
                      "rounded-xl",
                      "text-[17px]",
                      "font-normal",
                      "bg-[#FF3B30] dark:bg-[#FF453A]",
                      "hover:bg-[#FF3B30]/90 dark:hover:bg-[#FF453A]/90",
                      "active:bg-[#FF3B30]/80 dark:active:bg-[#FF453A]/80",
                      "text-white",
                      "transition-colors duration-200",
                      "m-0"
                    )}
                  >
                    {t('logout')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;