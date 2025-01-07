import { User, CheckCircle2, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessagesFilter } from "./MessagesFilter";

interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  status: string;
}

export const AdminMessagesList = () => {
  const navigate = useNavigate();
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
    <div className="space-y-4">
      <MessagesFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredMessages.map((patient) => (
          <Button
            key={patient.id}
            variant="ghost"
            className="w-full justify-start p-4 h-auto"
            onClick={() => navigate(`/chat/${patient.id}`)}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{patient.full_name}</span>
                  <Badge variant={patient.status === 'resolved' ? 'default' : 'destructive'}>
                    {patient.status === 'resolved' ? 'Resolved' : 'Pending'}
                  </Badge>
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
        ))}
        {filteredMessages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
};