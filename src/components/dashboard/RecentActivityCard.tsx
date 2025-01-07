import { FileText, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const RecentActivityCard = () => {
  return (
    <Card className="col-span-1 h-[300px] flex flex-col bg-white hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-primary">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Medical Report Uploaded</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
            <MessageSquare className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Chat with Dr. Ali</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};