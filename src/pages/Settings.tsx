import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Bell, Lock, ChevronRight, ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { motion } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { Card } from "@/components/ui/card";

const Settings = () => {
  const { t, language } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newMode ? 'dark' : 'light');
  };

  const SettingCard = ({ icon: Icon, title, children, className = "" }) => (
    <Card className={`p-6 transition-all duration-300 hover:shadow-lg dark:bg-gray-800/50 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      {children}
    </Card>
  );

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container max-w-4xl mx-auto p-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <BackButton />
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent ${isRTL ? 'mr-4' : 'ml-4'}`}>
            {t('settings')}
          </h1>
        </motion.div>

        {/* Settings Grid */}
        <div className="grid gap-6">
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SettingCard icon={isDarkMode ? Moon : Sun} title={t('appearance')}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('dark_mode')}</span>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </SettingCard>
          </motion.div>

          {/* Language */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SettingCard icon={Globe} title={t('language')}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-muted-foreground">{t('select_language')}</span>
                <LanguageSelector />
              </div>
            </SettingCard>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SettingCard icon={Bell} title={t('notifications')}>
              <div className="space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('push_notifications')}</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('email_notifications')}</span>
                  <Switch className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </SettingCard>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SettingCard icon={Lock} title={t('privacy')}>
              <div className="space-y-4">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('online_status')}</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t('read_receipts')}</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </div>
            </SettingCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;