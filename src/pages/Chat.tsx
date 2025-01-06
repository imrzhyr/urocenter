import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<{
    complaint: string;
    reportsCount: number;
  }>({ complaint: "", reportsCount: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPatientInfo = async () => {
    try {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) return;

      // Fetch profile information
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, complaint')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileData) {
        // Fetch medical reports count
        const { data: reports } = await supabase
          .from('medical_reports')
          .select('id')
          .eq('user_id', profileData.id);

        setPatientInfo({
          complaint: profileData.complaint || "",
          reportsCount: reports?.length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching patient info:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchPatientInfo();
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
    setTimeout(scrollToBottom, 100);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to send messages');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        content: message.trim(),
        is_from_doctor: false,
        user_id: user.id
      });

    if (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } else {
      setMessage('');
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png" alt="Dr. Ali Kamal" />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">Dr. Ali Kamal</h2>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>

        {/* Patient Information Card */}
        <Card className="bg-muted/50 border-none animate-fade-in">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Medical Reports:</span>
                </div>
                <span className="text-sm font-semibold">{patientInfo.reportsCount}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Chief Complaint:</h3>
                <p className="text-sm text-muted-foreground">{patientInfo.complaint || "No complaint recorded"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${msg.is_from_doctor ? 'justify-start' : 'justify-end'}`}
          >
            {msg.is_from_doctor && (
              <Avatar className="mr-2">
                <AvatarImage src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png" alt="Dr. Ali Kamal" />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 max-w-[80%] ${
                msg.is_from_doctor
                ? 'bg-muted text-foreground'
                : 'bg-primary text-primary-foreground'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;