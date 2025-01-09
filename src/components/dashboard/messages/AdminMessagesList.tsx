import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessagesFilter } from "./MessagesFilter";
import { MessageStatus } from "@/types/messages";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useMessagesList } from "./hooks/useMessagesList";
import { MessageItem } from "./components/MessageItem";

export const AdminMessagesList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");
  const { messages, isLoading } = useMessagesList();
  const { profile } = useProfile();

  const handlePatientClick = async (patientId: string) => {
    if (patientId === profile?.id) {
      toast.error("Cannot chat with yourself");
      return;
    }
    
    // Mark all unread messages as read when opening the chat
    const { error } = await supabase
      .from('messages')
      .update({ 
        is_read: true,
        status: 'seen',
        seen_at: new Date().toISOString()
      })
      .eq('user_id', patientId)
      .eq('is_read', false)
      .eq('is_from_doctor', false);

    if (error) {
      console.error('Error marking messages as read:', error);
    }
    
    console.log('Navigating to patient chat:', patientId);
    navigate(`/chat/${patientId}`);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-primary">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      <MessagesFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={(value: MessageStatus | "all") => setStatusFilter(value)}
      />
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No messages found
          </div>
        ) : (
          filteredMessages.map((patient, index) => (
            <MessageItem
              key={patient.id}
              patient={patient}
              index={index}
              onPatientClick={handlePatientClick}
            />
          ))
        )}
      </div>
    </div>
  );
};