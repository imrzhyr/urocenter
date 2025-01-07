import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PatientChatPrompt } from "./messages/PatientChatPrompt";
import { AdminMessagesList } from "./messages/AdminMessagesList";
import { useProfile } from "@/hooks/useProfile";

export const MessagesCard = () => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isAdmin ? "Patient Messages" : "Medical Consultation"}
          </h2>
          <p className="text-sm text-gray-500">
            {isAdmin 
              ? "Review and respond to patient inquiries"
              : "Connect with our healthcare professionals"
            }
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-6">
        {isAdmin ? <AdminMessagesList /> : <PatientChatPrompt />}
      </div>
    </div>
  );
};