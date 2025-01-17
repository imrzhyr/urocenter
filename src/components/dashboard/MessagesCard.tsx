import { MessageSquare, Sparkles } from "lucide-react";
import { PatientChatPrompt } from "./messages/PatientChatPrompt";
import { AdminMessagesList } from "./messages/AdminMessagesList";
import { useProfile } from "@/hooks/useProfile";
import { useLanguage } from "@/contexts/LanguageContext";

export const MessagesCard = () => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isAdmin ? "Patient Communications" : "Virtual Medical Consultation"}
              </h2>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isAdmin ? "Review and respond to patient inquiries" : "Connect with your healthcare provider"}
            </p>
          </div>
        </div>
        <div className="w-full">
          {isAdmin ? <AdminMessagesList /> : <PatientChatPrompt />}
        </div>
      </div>
    </div>
  );
};