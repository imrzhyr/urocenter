import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageSquare, UserPlus, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AdminStats {
  total_patients: number;
  total_messages: number;
  new_patients: number;
  resolved_chats: number;
}

export const AdminStatsCard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  const fetchStats = async () => {
    // Get all messages grouped by user_id to check for new patients
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select('user_id, is_read, is_from_doctor, is_resolved, created_at')
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return;
    }

    // Get total patients count
    const { count: totalPatients } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient');

    // Calculate new patients (patients who have never had their messages read)
    const newPatientsSet = new Set();
    const everReadPatientsSet = new Set();
    const resolvedChatsSet = new Set();

    // Group messages by user_id to track first message read status
    const userMessages = messagesData?.reduce((acc: { [key: string]: any }, message) => {
      if (!acc[message.user_id]) {
        acc[message.user_id] = [];
      }
      acc[message.user_id].push(message);
      return acc;
    }, {}) || {};

    // Process each user's messages
    Object.entries(userMessages).forEach(([userId, messages]: [string, any[]]) => {
      const hasEverBeenRead = messages.some(m => m.is_read);
      const hasUnreadMessages = messages.some(m => !m.is_from_doctor && !m.is_read);
      
      if (hasEverBeenRead) {
        everReadPatientsSet.add(userId);
      } else if (hasUnreadMessages) {
        newPatientsSet.add(userId);
      }

      if (messages.some(m => m.is_resolved)) {
        resolvedChatsSet.add(userId);
      }
    });

    // Remove patients who have ever had messages read from new patients
    everReadPatientsSet.forEach(id => newPatientsSet.delete(id));

    setStats({
      total_patients: totalPatients || 0,
      total_messages: messagesData?.length || 0,
      new_patients: newPatientsSet.size,
      resolved_chats: resolvedChatsSet.size
    });
  };

  useEffect(() => {
    fetchStats();

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
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const statItems = [
    {
      title: "Total Patients",
      value: stats?.total_patients || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Messages",
      value: stats?.total_messages || 0,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "New Patients",
      value: stats?.new_patients || 0,
      icon: UserPlus,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Resolved",
      value: stats?.resolved_chats || 0,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 px-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className={`${item.bgColor} ${item.color} p-2 rounded-full`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pb-4 px-4">
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};