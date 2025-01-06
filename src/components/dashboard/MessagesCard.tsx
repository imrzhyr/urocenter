import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminMessagesList } from "./messages/AdminMessagesList";
import { PatientChatPrompt } from "./messages/PatientChatPrompt";
import { MessagesFilter } from "./messages/MessagesFilter";

interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  status: string;
}

export const MessagesCard = () => {
  const [patients, setPatients] = useState<PatientMessage[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const userPhone = localStorage.getItem('userPhone');
      if (!userPhone) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('phone', userPhone)
        .single();

      setIsAdmin(profile?.role === 'admin');
    };

    checkUserRole();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const userPhone = localStorage.getItem('userPhone');
        if (!userPhone) return;

        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            status,
            user_id,
            profiles:profiles!messages_user_id_fkey (
              id,
              full_name
            )
          `)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        const patientMap = new Map<string, PatientMessage>();
        
        messages?.forEach((message) => {
          const patientId = message.profiles?.id;
          if (patientId && !patientMap.has(patientId)) {
            patientMap.set(patientId, {
              id: patientId,
              full_name: message.profiles?.full_name || 'Anonymous',
              last_message: message.content,
              last_message_time: message.created_at,
              status: message.status
            });
          }
        });

        const patientsList = Array.from(patientMap.values());
        setPatients(patientsList);
        setFilteredPatients(patientsList);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

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
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = [...patients];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(patient =>
        patient.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPatients(filtered);
  }, [statusFilter, searchQuery, patients]);

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          {isAdmin ? "Patient Messages" : "Chat with Doctor"}
        </CardTitle>
        <CardDescription>
          {isAdmin ? "Chat with your patients" : "Get medical assistance"}
        </CardDescription>
        {isAdmin && (
          <MessagesFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[280px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : isAdmin ? (
            <AdminMessagesList messages={filteredPatients} />
          ) : (
            <PatientChatPrompt />
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};