import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const MessagesCard = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Messages</CardTitle>
        <CardDescription>Chat with your doctor</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full"
          onClick={() => navigate("/chat")}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Chat
        </Button>
      </CardContent>
    </Card>
  );
};