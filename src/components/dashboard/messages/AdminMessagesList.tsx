import { User, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  status: string;
}

interface AdminMessagesListProps {
  messages: PatientMessage[];
}

export const AdminMessagesList = ({ messages }: AdminMessagesListProps) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'not_seen':
        return <Badge variant="destructive">Not Seen</Badge>;
      default:
        return <Badge variant="secondary">In Progress</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'not_seen':
        return <Circle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No messages found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((patient) => (
        <Button
          key={patient.id}
          variant="ghost"
          className="w-full justify-start p-4 h-auto"
          onClick={() => navigate(`/chat/${patient.id}`)}
        >
          <div className="flex items-start gap-3 w-full">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium">{patient.full_name}</span>
                {getStatusBadge(patient.status)}
              </div>
              <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                {getStatusIcon(patient.status)}
                {patient.last_message}
              </p>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(patient.last_message_time).toLocaleDateString()}
              </div>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};