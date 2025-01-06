import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  status: string;
  created_at: string;
  user: {
    full_name: string;
    complaint: string;
  };
}

export const MessagesCard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            status,
            created_at,
            user:profiles(full_name, complaint)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_seen':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'seen':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_seen':
        return 'Not seen';
      case 'seen':
        return 'Seen';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const handleMessageClick = (messageId: string) => {
    navigate(`/chat/${messageId}`);
  };

  if (isLoading) {
    return <Card className="p-6">Loading messages...</Card>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Recent Messages
        </h2>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => handleMessageClick(message.id)}
            className="p-4 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-blue-900">{message.user?.full_name || 'Unknown Patient'}</h3>
                <p className="text-sm text-blue-600 mt-1">{message.content}</p>
                {message.user?.complaint && (
                  <p className="text-xs text-gray-500 mt-1">Chief Complaint: {message.user.complaint}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(message.status)}
                <span className="text-sm text-gray-600">{getStatusText(message.status)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};