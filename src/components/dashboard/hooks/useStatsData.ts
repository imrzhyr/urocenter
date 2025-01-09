import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  total_patients: number;
  total_messages: number;
  new_patients: number;
  resolved_chats: number;
}

export const useStatsData = () => {
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

  return {
    stats,
    refetchStats: fetchStats
  };
};