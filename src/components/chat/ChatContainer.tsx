import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { PatientInfoContainer } from "./PatientInfoContainer";

interface Message {
  id: string;
  content: string;
  is_from_doctor: boolean;
  created_at: string;
  delivered_at: string | null;
  seen_at: string | null;
  status: string;
  user_id: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
}

interface ChatContainerProps {
  patientId?: string;
}

export const ChatContainer = ({ patientId }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        return;
      }

      setMessages(data as Message[]);
    };

    fetchMessages();

    // Subscribe to new messages and updates
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${patientId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages(prev => [...prev, payload.new as Message]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !patientId) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('messages')
      .insert({
        content: newMessage.trim(),
        user_id: patientId,
        is_from_doctor: true,
        status: 'sent'
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
      toast.success("Message sent");
    }
    setIsLoading(false);
  };

  const MessageStatus = ({ message }: { message: Message }) => {
    if (message.is_from_doctor) {
      if (message.seen_at) {
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      } else if (message.delivered_at) {
        return <CheckCheck className="w-4 h-4 text-gray-500" />;
      } else {
        return <Check className="w-4 h-4 text-gray-500" />;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <PatientInfoContainer patientId={patientId} />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_from_doctor ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.is_from_doctor
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
                <MessageStatus message={message} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !newMessage.trim()}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};