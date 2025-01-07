import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminMessagesList } from "./messages/AdminMessagesList";
import { MessagesFilter } from "./messages/MessagesFilter";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  status: string;
}

export const MessagesCard = () => {
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            messages (
              content,
              created_at,
              status
            )
          `)
          .eq('role', 'patient')
          .order('created_at', { foreignTable: 'messages', ascending: false });

        if (profilesError) throw profilesError;

        const formattedMessages = profiles
          ?.filter(profile => profile.messages && profile.messages.length > 0)
          .map(profile => ({
            id: profile.id,
            full_name: profile.full_name || "Unknown Patient",
            last_message: profile.messages[0].content,
            last_message_time: profile.messages[0].created_at,
            status: profile.messages[0].status
          })) || [];

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Messages
        </CardTitle>
        <CardDescription>
          Manage patient conversations
        </CardDescription>
        <MessagesFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <AdminMessagesList messages={filteredMessages} />
      </CardContent>
    </Card>
  );
};