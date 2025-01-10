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
    <div className="bg-white rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {isAdmin ? t("dashboard.consultation.title") : t("dashboard.consultation.title")}
              </h2>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-gray-600">
              {isAdmin ? t("dashboard.consultation.subtitle") : t("dashboard.consultation.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {isAdmin ? <AdminMessagesList /> : <PatientChatPrompt />}
        </div>
      </div>
    </div>
  );
};