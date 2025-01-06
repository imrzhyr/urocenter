import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, FileText, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-card border-b">
        <h1 className="text-xl font-semibold">Welcome, John</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>العربية</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2"
        >
          <MessageSquare className="w-8 h-8" />
          <span>Chat with Doctor</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2"
        >
          <Calendar className="w-8 h-8" />
          <span>Book Appointment</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2"
        >
          <FileText className="w-8 h-8" />
          <span>Medical Records</span>
        </Button>
        <Button
          variant="outline"
          className="h-32 flex flex-col items-center justify-center space-y-2"
        >
          <Calendar className="w-8 h-8" />
          <span>Follow-up</span>
        </Button>
      </div>

      {/* Next Appointment */}
      <div className="mt-auto p-4 bg-card border-t">
        <h2 className="font-semibold mb-2">Next Appointment</h2>
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Video Consultation</p>
              <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
            </div>
            <Button size="sm">Join</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;