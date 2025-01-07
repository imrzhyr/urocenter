import { MessageSquare, Sparkles } from "lucide-react";
import { PatientChatPrompt } from "./messages/PatientChatPrompt";
import { AdminMessagesList } from "./messages/AdminMessagesList";
import { useProfile } from "@/hooks/useProfile";

export const MessagesCard = () => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {isAdmin ? "Patient Messages" : "Virtual Consultation"}
              </h2>
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-sm text-gray-600">
              {isAdmin ? "Review patient inquiries" : "Connect with Dr. Ali Kamal"}
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