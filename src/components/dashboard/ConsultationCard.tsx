import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { MessageSquare, Image as ImageIcon, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/profile";
import { format } from "date-fns";

export const ConsultationCard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isRTL = language === 'ar';

  useEffect(() => {
    const fetchLatestMessage = async () => {
      try {
        const profileId = localStorage.getItem('profileId');
        if (!profileId) return;

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', profileId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching latest message:', error);
          return;
        }

        setLatestMessage(data);
      } catch (error) {
        console.error('Error in fetchLatestMessage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestMessage();

    // Subscribe to new messages
    const profileId = localStorage.getItem('profileId');
    if (!profileId) return;

    const channel = supabase
      .channel(`messages_${profileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${profileId}`
        },
        () => {
          fetchLatestMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderMessagePreview = () => {
    if (!latestMessage) return null;

    let content = latestMessage.content;
    const icon = latestMessage.file_type ? 
      latestMessage.file_type.startsWith('image') ? <ImageIcon className="w-4 h-4 text-[#0A84FF]" /> :
      latestMessage.file_type.startsWith('audio') ? <Mic className="w-4 h-4 text-[#0A84FF]" /> : null : null;

    if (latestMessage.file_type) {
      content = t(latestMessage.file_type.startsWith('image') ? 'photo_message' : 
                  latestMessage.file_type.startsWith('audio') ? 'voice_message' : 'file_message');
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "flex flex-col w-full",
          "bg-[#2C2C2E]/50 dark:bg-[#2C2C2E]/30",
          "backdrop-blur-xl",
          "border border-white/[0.08]",
          "rounded-xl",
          "p-4",
          "mt-2",
          "hover:bg-[#2C2C2E]/70 dark:hover:bg-[#2C2C2E]/50",
          "transition-colors duration-200"
        )}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              latestMessage.is_from_doctor ? "bg-[#30D158]" : "bg-[#0A84FF]"
            )} />
            <span className="text-sm font-medium text-white/90">
              {latestMessage.is_from_doctor ? t('doctor') : t('you')}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(latestMessage.created_at), 'h:mm a')}
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-3",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          {icon && (
            <div className={cn(
              "w-8 h-8",
              "rounded-full",
              "bg-[#0A84FF]/10",
              "flex items-center justify-center"
            )}>
              {icon}
            </div>
          )}
          <p className={cn(
            "text-white/80 text-sm truncate flex-1",
            isRTL ? "text-right" : "text-left"
          )}>
            {content}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "bg-[#1A1F2C] dark:bg-[#1C1C1E]",
        "rounded-2xl",
        "overflow-hidden",
        "p-6",
        "flex flex-col items-center",
        "text-center",
        "space-y-6",
        "cursor-pointer",
        "hover:bg-[#1A1F2C]/90 dark:hover:bg-[#1C1C1E]/90",
        "transition-colors duration-200"
      )}
      onClick={() => navigate("/chat")}
    >
      <div className="flex flex-col items-center space-y-4 w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "w-16 h-16",
            "bg-[#007AFF]/10 dark:bg-[#0A84FF]/10",
            "rounded-2xl",
            "flex items-center justify-center"
          )}
        >
          <MessageSquare className="w-8 h-8 text-[#007AFF] dark:text-[#0A84FF]" />
        </motion.div>

        <div className="space-y-2 w-full">
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-2xl font-semibold",
              "text-white"
            )}
          >
            {t("virtual_medical_consultation")}
          </motion.h2>

          {!isLoading && (
            latestMessage ? (
              renderMessagePreview()
            ) : (
              <>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "text-[#8E8E93] dark:text-[#98989D]",
                    "text-base"
                  )}
                >
                  {t("connect_with_doctor")}
                </motion.p>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={cn(
                    "w-full",
                    "bg-[#007AFF] dark:bg-[#0A84FF]",
                    "hover:bg-[#0071E3] dark:hover:bg-[#0A84FF]/90",
                    "active:bg-[#0051A2] dark:active:bg-[#0A84FF]/80",
                    "text-white",
                    "font-medium",
                    "py-4",
                    "mt-4",
                    "rounded-xl",
                    "transition-all duration-200"
                  )}
                >
                  {t("start_consultation")}
                </motion.button>
              </>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}; 