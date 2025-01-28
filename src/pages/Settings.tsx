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
import { ChevronRight } from "lucide-react";

const Settings = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

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
    <div className="min-h-screen bg-[#000000]">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <header className="p-4">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1 className="text-2xl font-semibold text-white">{t('settings')}</h1>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 space-y-6"
        >
          <Card className="p-6 bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08]">
            <h2 className="text-lg font-medium mb-4 text-white">{t('language')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0A84FF]" />
                <span className="text-gray-300">{t('select_language')}</span>
              </div>
              <button
                onClick={() => setShowLanguageMenu(true)}
                className="flex items-center gap-2 p-2 rounded-xl bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
              >
                <Globe className="w-5 h-5 text-[#0A84FF]" />
              </button>
            </div>
          </Card>

          {/* Other settings sections */}
          {settingsSections.map((section, index) => (
            <Card 
              key={index}
              className="p-6 bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08]"
            >
              <button
                onClick={section.onClick}
                className="w-full flex items-center justify-between text-white hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-[#0A84FF]" />
                  <span>{section.title}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </Card>
          ))}

          {/* Logout button */}
          <Card className="p-6 bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/[0.08]">
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full flex items-center gap-2 text-[#FF453A]"
            >
              <LogOut className="h-5 w-5" />
              <span>{t('sign_out')}</span>
            </button>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showLanguageMenu && (
          <LanguageSelector onClose={() => setShowLanguageMenu(false)} />
        )}
      </AnimatePresence>

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
            <AlertDialogAction onClick={handleLogout}>{t('sign_out')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;