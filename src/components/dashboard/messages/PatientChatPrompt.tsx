import { MessageSquare, Stethoscope, Image as ImageIcon, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  const fetchLastMessage = async () => {
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching last message:', error);
      }

      console.log('Last message:', data);
      setLastMessage(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastMessage();

    // Subscribe to message updates
    if (profile?.id) {
      const channel = supabase
        .channel(`messages_${profile.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `user_id=eq.${profile.id}`
          },
          async (payload) => {
            console.log('Received message update:', payload);
            await fetchLastMessage();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.id]);

  const handleChatNavigation = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(2);
    }
    navigate('/chat');
  };

  const getMessagePreview = (message: any) => {
    if (message.content) {
      return message.content;
    }
    
    if (message.file_url) {
      const generalType = message.file_type?.split('/')[0];
      
      if (generalType === 'image') {
        return (
          <span className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <ImageIcon className="w-[18px] h-[18px] text-[#8E8E93] dark:text-[#98989D]" />
            {t("sent_photo")}
          </span>
        );
      }
      
      if (generalType === 'audio') {
        return (
          <span className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Mic className="w-[18px] h-[18px] text-[#8E8E93] dark:text-[#98989D]" />
            {t("sent_voice_message")}
          </span>
        );
      }
      
      return t("sent_attachment");
    }
    
    return '';
  };

  if (loading) {
    return null;
  }

  if (!lastMessage) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="text-center space-y-6 py-6 w-full"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: 0.1
          }}
          className="relative inline-block"
        >
          <div className={cn(
            "p-5",
            "bg-[#007AFF]/10 dark:bg-[#0A84FF]/10",
            "rounded-2xl"
          )}>
            <Stethoscope className="w-12 h-12 text-[#007AFF] dark:text-[#0A84FF]" />
          </div>
        </motion.div>

        <div className="max-w-sm mx-auto px-4">
          <motion.h3 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.2
            }}
            className={cn(
              "text-[20px]", // iOS headline
              "font-semibold",
              "text-[#1C1C1E] dark:text-white",
              "mb-2"
            )}
          >
            {t("start_consultation")}
          </motion.h3>

          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.3
            }}
            className={cn(
              "text-[15px]", // iOS subheadline
              "text-[#8E8E93] dark:text-[#98989D]",
              "mb-6"
            )}
          >
            {t("doctor_surgery")}
          </motion.p>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.4
            }}
          >
            <Button 
              onClick={handleChatNavigation}
              className={cn(
                "w-full max-w-[200px]",
                "h-11", // iOS button height
                "bg-[#007AFF] dark:bg-[#0A84FF]",
                "hover:bg-[#0071E3] dark:hover:bg-[#0A84FF]/90",
                "active:bg-[#0051A2] dark:active:bg-[#0A84FF]/80",
                "shadow-sm",
                "rounded-xl",
                "text-[17px]", // iOS body
                "font-normal",
                "transition-colors duration-200",
                "flex items-center justify-center gap-2",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
            >
              <MessageSquare className="w-[18px] h-[18px]" />
              {t("chat")}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      onClick={handleChatNavigation}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "w-full cursor-pointer",
        "bg-[#F2F2F7] dark:bg-[#2C2C2E]",
        "hover:bg-[#E5E5EA] dark:hover:bg-[#3A3A3C]",
        "active:bg-[#D1D1D6] dark:active:bg-[#48484A]",
        "p-4 rounded-xl",
        "transition-colors duration-200"
      )}
    >
      <div className={cn(
        "flex items-center gap-4",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "w-12 h-12",
          "rounded-full",
          "bg-[#007AFF]/10 dark:bg-[#0A84FF]/10",
          "flex items-center justify-center",
          "overflow-hidden"
        )}>
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            src="/lovable-uploads/7ac98ca7-e043-4da5-afac-f986ff382bcf.png"
            alt={t("doctor_name")}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <motion.h3 
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1
            }}
            className={cn(
              "text-[17px]", // iOS body
              "font-semibold",
              "text-[#1C1C1E] dark:text-white",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {t("doctor_name")}
          </motion.h3>

          <motion.div 
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.2
            }}
            className={cn(
              "flex items-center gap-2",
              isRTL ? "flex-row-reverse justify-end" : "flex-row"
            )}
          >
            <p className={cn(
              "text-[13px]", // iOS caption
              "text-[#8E8E93] dark:text-[#98989D]",
              "truncate"
            )}>
              {getMessagePreview(lastMessage)}
            </p>
            <span className={cn(
              "text-[13px]", // iOS caption
              "text-[#8E8E93] dark:text-[#98989D]",
              "whitespace-nowrap"
            )}>
              {format(new Date(lastMessage.created_at), 'MMM d, h:mm a')}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};