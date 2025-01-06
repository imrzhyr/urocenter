import { FileText, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const RecentActivityCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest medical updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Medical Report Uploaded</p>
              <p className="text-sm text-muted-foreground">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Chat with Dr. Ali</p>
              <p className="text-sm text-muted-foreground">3 days ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};