import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface PatientMessage {
  id: string;
  full_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const MessagesCard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles:profiles!messages_user_id_fkey (
              id,
              full_name
            )
          `)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Process messages to get unique patients with their latest message
        const patientMap = new Map<string, PatientMessage>();
        
        messages?.forEach((message) => {
          const patientId = message.profiles?.id;
          if (patientId && !patientMap.has(patientId)) {
            patientMap.set(patientId, {
              id: patientId,
              full_name: message.profiles?.full_name || 'Anonymous Patient',
              last_message: message.content,
              last_message_time: message.created_at,
              unread_count: 0 // You can implement this later
            });
          }
        });

        setPatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Patient Messages
        </CardTitle>
        <CardDescription>Chat with your patients</CardDescription>
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
          ) : patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map((patient) => (
                <Button
                  key={patient.id}
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto"
                  onClick={() => navigate(`/chat/${patient.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{patient.full_name}</div>
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
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No messages yet
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};