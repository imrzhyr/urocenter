import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MessagesCard = () => {
  console.log("Rendering MessagesCard with placeholder");
  
  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Chat with Doctor
        </CardTitle>
        <CardDescription>
          Get medical assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <MessageSquare className="w-12 h-12 text-blue-500 mx-auto" />
          <div>
            <h3 className="font-medium text-lg">Chat functionality coming soon!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              We're working on bringing you a better chat experience.
            </p>
          </div>
          <Button 
            className="mt-4"
            disabled
          >
            Coming Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};