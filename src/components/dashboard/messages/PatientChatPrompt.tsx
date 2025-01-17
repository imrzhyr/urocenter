import { MessageSquare, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

export const PatientChatPrompt = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchLastMessage = async () => {
      if (!profile?.id) return;
      
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

        setLastMessage(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastMessage();
  }, [profile?.id]);

  const handleChatNavigation = () => {
    navigate('/chat');
  };

  if (loading) {
    return null;
  }

  if (!lastMessage) {
    return (
      <div className="text-center space-y-4 py-4 w-full">
        <div className="relative inline-block">
          <div className="relative">
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-full">
              <Stethoscope className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="max-w-sm mx-auto">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {t("start_consultation")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t("doctor_surgery")}
          </p>
          <Button 
            onClick={handleChatNavigation}
            className="w-full max-w-[200px] bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {t("chat")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleChatNavigation}
      className="w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-4 rounded-lg border dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <img
            src="/lovable-uploads/7ac98ca7-e043-4da5-afac-f986ff382bcf.png"
            alt={t("doctor_name")}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{t("doctor_name")}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(lastMessage.created_at), 'MMM d, h:mm a')}
          </p>
        </div>
      </div>
      <div className="pl-[60px]">
        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
          {lastMessage.content || (lastMessage.file_url ? t("sent_attachment") : '')}
        </p>
      </div>
    </div>
  );
};