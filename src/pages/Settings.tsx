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
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const Settings = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userPhone');
    setShowLogoutDialog(false);
    navigate('/');
    toast.success(t('logged_out_successfully'));
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
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6 justify-between">
          {isRTL ? (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{t('settings')}</h1>
              <BackButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <BackButton />
              <h1 className="text-2xl font-semibold">{t('settings')}</h1>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">{t('language')}</h2>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Globe className="h-5 w-5" />
                <span>{t('select_language')}</span>
              </div>
              <LanguageSelector />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">{t('notifications')}</h2>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('logout')}
          </Button>
        </motion.div>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="text-center text-xl font-semibold">
            {t('confirm_logout')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('logout_confirmation_message')}
          </DialogDescription>
          <DialogFooter className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;