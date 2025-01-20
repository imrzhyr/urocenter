import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Bell, HelpCircle, Info, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { motion } from "framer-motion";
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
                className="p-4 cursor-pointer hover:bg-accent transition-colors"
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
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </motion.div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm_logout')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('logout_confirmation_message')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('logout')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;