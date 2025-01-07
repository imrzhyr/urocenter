import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessagesFilter } from "./MessagesFilter";
import { MessageStatusBadge } from "./MessageStatusBadge";
import { PatientMessage } from "@/types/messages";
import { fetchPatientMessages } from "@/utils/messageUtils";

export const AdminMessagesList = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const patientMessages = await fetchPatientMessages();
        setMessages(patientMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  return (
    <div className="space-y-4">
      <MessagesFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((patient) => (
            <Button
              key={patient.id}
              variant="ghost"
              className="w-full justify-start p-4 h-auto hover:bg-primary/5"
              onClick={() => navigate(`/chat/${patient.id}`)}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{patient.full_name}</span>
                    <MessageStatusBadge 
                      status={patient.status as any} 
                      unreadCount={patient.unread_count}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {patient.last_message}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(patient.last_message_time).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Button>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No messages found. New patient messages will appear here.
          </div>
        )}
      </div>
    </div>
  );
};