import { MessageSquare } from "lucide-react";
import { PatientChatPrompt } from "./messages/PatientChatPrompt";
import { AdminMessagesList } from "./messages/AdminMessagesList";
import { useProfile } from "@/hooks/useProfile";

export const MessagesCard = () => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-base font-medium text-gray-900">
            {isAdmin ? "Patient Messages" : "Medical Consultation"}
          </h2>
        </div>
      </div>
      <div className="flex items-center justify-center">
        {isAdmin ? <AdminMessagesList /> : <PatientChatPrompt />}
      </div>
    </div>
  );
};