import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MessagesFilter } from "./MessagesFilter";
import { MessageStatusBadge } from "./MessageStatusBadge";
import { PatientMessage, MessageStatus } from "@/types/messages";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const AdminMessagesList = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MessageStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useProfile();

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages for admin list');
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          status,
          is_read,
          is_resolved,
          user_id,
          is_from_doctor,
          profiles (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        toast.error("Failed to load messages");
        return;
      }

      if (!messagesData) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      const userMessages = messagesData.reduce((acc: { [key: string]: PatientMessage }, message: any) => {
        const userId = message.user_id;
        if (userId === profile?.id) {
          return acc;
        }
        
        const userName = message.profiles?.full_name || "Unknown Patient";
        
        if (!acc[userId] || new Date(message.created_at) > new Date(acc[userId].last_message_time)) {
          // Only count unread messages from patients, not from doctor
          const unreadCount = messagesData.filter(
            msg => msg.user_id === userId && !msg.is_read && !msg.is_from_doctor
          ).length;

          acc[userId] = {
            id: userId,
            full_name: userName,
            last_message: message.content || "",
            last_message_time: message.created_at,
            status: message.status as MessageStatus || 'not_seen',
            unread_count: unreadCount,
            is_resolved: message.is_resolved || false
          };
        }
        return acc;
      }, {});

      const formattedMessages = Object.values(userMessages);
      console.log('Formatted messages:', formattedMessages);
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

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
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, []);

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
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start p-4 h-auto hover:bg-primary/5 transition-all duration-300"
                onClick={() => handlePatientClick(patient.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10">
                      {patient.full_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-base">{patient.full_name}</span>
                      <div className="flex items-center gap-2">
                        {patient.is_resolved && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Resolved
                          </span>
                        )}
                        <MessageStatusBadge 
                          status={patient.status} 
                          unreadCount={patient.unread_count}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {patient.last_message}
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(patient.last_message_time).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};