import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, User, CheckCircle2, Circle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  status: string;
}

export const MessagesCard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientMessage[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
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
              full_name: message.profiles?.full_name || 'Anonymous Patient',
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
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();

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
          fetchPatients(); // Refresh messages when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = [...patients];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(patient =>
        patient.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPatients(filtered);
  }, [statusFilter, searchQuery, patients]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'not_seen':
        return <Badge variant="destructive">Not Seen</Badge>;
      default:
        return <Badge variant="secondary">In Progress</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'not_seen':
        return <Circle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Patient Messages
        </CardTitle>
        <CardDescription>Chat with your patients</CardDescription>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="not_seen">Not Seen</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          ) : filteredPatients.length > 0 ? (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
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
                        {getStatusBadge(patient.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate flex items-center gap-2">
                        {getStatusIcon(patient.status)}
                        {patient.last_message}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(patient.last_message_time).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No messages found
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};