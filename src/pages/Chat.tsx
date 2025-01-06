import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { PatientInfoCard } from "@/components/chat/PatientInfoCard";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, complaint')
        .eq('phone', userPhone)
        .maybeSingle();

      if (profileData) {
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

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { data, error: uploadError } = await supabase.storage
      .from('chat_attachments')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat_attachments')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      name: file.name,
      type: file.type
    };
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to send messages');
      setIsLoading(false);
      return;
    }

    try {
      let fileData = null;
      if (selectedFile) {
        fileData = await uploadFile(selectedFile);
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          content: message.trim(),
          is_from_doctor: false,
          user_id: user.id,
          file_url: fileData?.url,
          file_name: fileData?.name,
          file_type: fileData?.type
        });

      if (error) {
        throw error;
      }

      setMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="p-4 bg-white border-b border-blue-100 shadow-sm">
        <ChatHeader onBack={() => navigate(-1)} />
        <PatientInfoCard 
          complaint={patientInfo.complaint}
          reportsCount={patientInfo.reportsCount}
        />
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id || index}
            content={msg.content}
            isFromDoctor={msg.is_from_doctor}
            fileUrl={msg.file_url}
            fileName={msg.file_name}
            fileType={msg.file_type}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        message={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        isLoading={isLoading}
        onKeyPress={handleKeyPress}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

export default Chat;