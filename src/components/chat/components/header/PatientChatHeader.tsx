import * as React from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { BackButton } from "@/components/BackButton";
import { Phone, Settings, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HeaderButtonProps {
  onClick: () => void;
  className?: string;
  icon: React.ReactNode;
}

const HeaderButton = React.memo(({ onClick, className, icon }: HeaderButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "p-2 rounded-full",
      "hover:bg-white/10",
      "transition-colors",
      "active:bg-white/20",
      className
    )}
  >
    {icon}
  </motion.button>
));

HeaderButton.displayName = 'HeaderButton';

export const PatientChatHeader = React.memo(() => {
  const { t } = useLanguage();

  const handleCall = () => {
    console.log('Initiating call with doctor');
  };

  const handleSettings = () => {
    console.log('Opening chat settings');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-between",
        "px-4 py-3",
        "bg-[#1C1C1E]/95",
        "backdrop-blur-lg",
        "border-b border-[#3C3C43]/30",
        "sticky top-0 z-10"
      )}
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <BackButton 
            customRoute="/dashboard" 
            className={cn(
              "flex items-center gap-1",
              "text-[#007AFF]",
              "font-medium",
              "-ml-2"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </BackButton>
        </motion.div>

        <div className="flex flex-col">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "font-semibold",
              "text-[17px]",
              "leading-[1.3]",
              "text-white"
            )}
          >
            {t('doctor_chat')}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "text-[13px]",
              "leading-[1.2]",
              "text-[#8E8E93]"
            )}
          >
            {t('online')}
          </motion.p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <HeaderButton 
          onClick={handleCall}
          icon={<Phone className="w-[22px] h-[22px]" />}
          className="text-[#007AFF]"
        />
        <HeaderButton 
          onClick={handleSettings}
          icon={<Settings className="w-[22px] h-[22px]" />}
          className="text-[#007AFF]"
        />
      </div>
    </motion.div>
  );
});

PatientChatHeader.displayName = 'PatientChatHeader'; 