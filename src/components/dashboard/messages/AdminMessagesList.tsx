import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessagesFilter } from "./MessagesFilter";
import { MessageStatusBadge } from "./MessageStatusBadge";
import { PatientMessage } from "@/types/messages";

export const AdminMessagesList = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          status,
          is_read,
          user_id,
          profiles (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      console.log('Raw messages data:', messagesData);

      if (!messagesData || messagesData.length === 0) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      // Group messages by user and get the latest message for each user
      const userMessages = messagesData.reduce((acc: { [key: string]: PatientMessage }, message: any) => {
        const userId = message.user_id;
        const userName = message.profiles?.full_name || "Unknown Patient";
        
        // Count unread messages for this user
        const unreadCount = messagesData.filter(
          (msg: any) => msg.user_id === userId && !msg.is_read
        ).length;

        // Only update if this is the first message we've seen for this user
        // or if this message is more recent than the one we have
        if (!acc[userId] || new Date(message.created_at) > new Date(acc[userId].last_message_time)) {
          acc[userId] = {
            id: userId,
            full_name: userName,
            last_message: message.content,
            last_message_time: message.created_at,
            status: message.status,
            unread_count: unreadCount
          };
        }
        return acc;
      }, {});

      console.log('Processed user messages:', userMessages);
      setMessages(Object.values(userMessages));
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

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
          console.log('Received real-time update, refreshing messages...');
          fetchMessages();
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