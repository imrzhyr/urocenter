import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
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
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const isRTL = language === 'ar';

  const handleLogout = () => {
    // Add haptic feedback
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
    localStorage.removeItem('userPhone');
    navigate("/");
    toast.success(t('logged_out_successfully'), {
      className: cn(
        "bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/80",
        "backdrop-blur-xl",
        "border border-[#C6C6C8] dark:border-[#38383A]",
        "text-[#1C1C1E] dark:text-white",
        "rounded-2xl shadow-lg"
      )
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "w-8 h-8", // Reduced from w-10 h-10
              "rounded-full",
              "bg-white/10",
              "text-white",
              "hover:bg-white/20",
              "active:scale-95",
              "transition-all duration-200"
            )}
          >
            <User className="w-4 h-4" /> {/* Reduced from w-5 h-5 */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className={cn(
            "min-w-fit", // Changed from w-[100px] to min-w-fit
            "bg-[#F2F2F7]/80 dark:bg-[#1C1C1E]/80",
            "backdrop-blur-xl",
            "border border-[#C6C6C8] dark:border-[#38383A]",
            "shadow-lg",
            "rounded-2xl",
            "mt-2",
            "p-1",
            isRTL ? "mr-2" : "ml-2"
          )}
        >
          <DropdownMenuItem 
            onClick={() => {
              if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(2);
              }
              navigate('/settings');
            }} 
            className={cn(
              "cursor-pointer",
              "h-11",
              "w-fit", // Added w-fit
              "rounded-xl",
              "text-[17px]",
              "font-normal",
              "text-[#1C1C1E] dark:text-white",
              "hover:bg-[#007AFF]/10 dark:hover:bg-[#0A84FF]/10",
              "active:bg-[#007AFF]/20 dark:active:bg-[#0A84FF]/20",
              "transition-colors duration-200",
              "flex items-center gap-2 px-3", // Changed to px-3
              isRTL ? "flex-row-reverse" : "flex-row",
              "mx-auto" // Center the button
            )}
          >
            <Settings className="w-5 h-5" />
            {t('settings')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(2);
              }
              setShowLogoutDialog(true);
            }}
            className={cn(
              "cursor-pointer",
              "h-11",
              "w-fit", // Added w-fit
              "rounded-xl",
              "text-[17px]",
              "font-normal",
              "text-[#FF3B30] dark:text-[#FF453A]",
              "hover:bg-[#FF3B30]/10 dark:hover:bg-[#FF453A]/10",
              "active:bg-[#FF3B30]/20 dark:active:bg-[#FF453A]/20",
              "transition-colors duration-200",
              "flex items-center gap-2 px-3", // Changed to px-3
              isRTL ? "flex-row-reverse" : "flex-row",
              "mx-auto" // Center the button
            )}
          >
            <LogOut className="w-5 h-5" />
            {t('logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AnimatePresence>
        {showLogoutDialog && (
          <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialogContent className={cn(
              "bg-[#F2F2F7]/95 dark:bg-[#1C1C1E]/95",
              "backdrop-blur-xl",
              "border border-[#C6C6C8] dark:border-[#38383A]",
              "rounded-2xl",
              "shadow-xl",
              "p-0", // Remove padding to allow header to extend
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
    </>
  );
};