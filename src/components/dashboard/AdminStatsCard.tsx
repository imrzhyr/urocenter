import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface AdminStats {
  total_patients: number;
  total_messages: number;
  unread_messages: number;
  resolved_chats: number;
}

export const AdminStatsCard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .rpc('get_admin_stats');

      if (error) {
        console.error("Error fetching admin stats:", error);
        return;
      }

      if (data && data.length > 0) {
        setStats(data[0]);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Total Patients",
      value: stats?.total_patients || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Messages",
      value: stats?.total_messages || 0,
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Unread Messages",
      value: stats?.unread_messages || 0,
      icon: AlertCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Resolved Chats",
      value: stats?.resolved_chats || 0,
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <div className={`${item.bgColor} ${item.color} p-2 rounded-full`}>
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};