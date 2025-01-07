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
    <Card className="col-span-1 h-[300px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {isAdmin ? "Patient Messages" : "Medical Consultation"}
        </CardTitle>
        <CardDescription>
          {isAdmin 
            ? "Review and respond to patient inquiries"
            : "Connect with our healthcare professionals"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAdmin ? <AdminMessagesList /> : <PatientChatPrompt />}
      </CardContent>
    </Card>
  );
};