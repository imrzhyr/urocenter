import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PatientChatPrompt } from "./messages/PatientChatPrompt";

export const MessagesCard = () => {
  return (
    <Card className="col-span-1 h-[300px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Medical Consultation
        </CardTitle>
        <CardDescription>
          Connect with our healthcare professionals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PatientChatPrompt />
      </CardContent>
    </Card>
  );
};