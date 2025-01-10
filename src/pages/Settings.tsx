import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Moon, Sun, Globe, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NewEditProfileDialog } from "@/components/profile/NewEditProfileDialog";

const Settings = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className={`mr-4 ${language === 'ar' ? 'rotate-180' : ''}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">{t('settings')}</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Profile Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">{t('profile_settings.title')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{t('profile_settings.edit_profile')}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowEditProfile(true)}
              >
                {t('profile_settings.edit_profile')}
              </Button>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">{t('appearance')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span>{t('dark_mode')}</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>

          {/* Language Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">{t('language')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>{t('select_language')}</span>
              </div>
              <LanguageSelector />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">{t('notifications')}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t('push_notifications')}</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <NewEditProfileDialog
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />
    </div>
  );
};

export default Settings;