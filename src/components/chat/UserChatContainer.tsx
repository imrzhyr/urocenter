import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";

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

export const UserChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    if (!profile?.phone) return;

    const fetchMessages = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', profile.phone)
        .single();

      if (!profileData?.id) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        return;
      }

      setMessages(data as Message[]);

      // Mark messages as seen
      const unseenMessages = data?.filter(m => !m.seen_at && m.is_from_doctor) || [];
      if (unseenMessages.length > 0) {
        const { error: updateError } = await supabase
          .from('messages')
          .update({ 
            seen_at: new Date().toISOString(),
            status: 'seen'
          })
          .in('id', unseenMessages.map(m => m.id));

        if (updateError) {
          console.error('Error marking messages as seen:', updateError);
        }
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
            
            // If message is from doctor, mark as delivered
            if (newMessage.is_from_doctor) {
              const { error: updateError } = await supabase
                .from('messages')
                .update({ 
                  delivered_at: new Date().toISOString(),
                  status: 'delivered'
                })
                .eq('id', newMessage.id);

              if (updateError) {
                console.error('Error marking message as delivered:', updateError);
              }
            }
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
  }, [profile?.phone]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !profile?.phone) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', profile.phone)
      .single();

    if (!profileData?.id) {
      toast.error("Could not send message");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('messages')
      .insert({
        content: newMessage.trim(),
        user_id: profileData.id,
        is_from_doctor: false,
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
    if (!message.is_from_doctor) {
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_from_doctor ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.is_from_doctor
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-blue-500 text-white'
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