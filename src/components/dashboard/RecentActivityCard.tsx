import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Activity, FileText } from "lucide-react";
import { toast } from "sonner";

interface ActivityItem {
  id: string;
  type: 'message' | 'report';
  content: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

export const RecentActivityCard = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch recent messages
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            user:profiles(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (messagesError) throw messagesError;

        // Fetch recent medical reports
        const { data: reports, error: reportsError } = await supabase
          .from('medical_reports')
          .select(`
            id,
            file_name,
            created_at,
            user:profiles(full_name)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (reportsError) throw reportsError;

        // Combine and sort activities
        const combinedActivities = [
          ...messages.map(m => ({
            id: m.id,
            type: 'message' as const,
            content: m.content,
            created_at: m.created_at,
            user: m.user
          })),
          ...reports.map(r => ({
            id: r.id,
            type: 'report' as const,
            content: r.file_name,
            created_at: r.created_at,
            user: r.user
          }))
        ].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);

        setActivities(combinedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error("Failed to load recent activities");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (isLoading) {
    return <Card className="p-6">Loading activities...</Card>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-white border border-blue-100 rounded-lg"
          >
            <div className="flex items-start gap-3">
              {activity.type === 'message' ? (
                <Activity className="w-5 h-5 text-blue-500 mt-1" />
              ) : (
                <FileText className="w-5 h-5 text-green-500 mt-1" />
              )}
              <div>
                <h3 className="font-medium text-blue-900">{activity.user?.full_name || 'Unknown Patient'}</h3>
                <p className="text-sm text-blue-600 mt-1">
                  {activity.type === 'message' ? 'Sent a message: ' : 'Uploaded a file: '}
                  {activity.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};