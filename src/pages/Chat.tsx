import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Phone, Send, Video } from "lucide-react";

const Chat = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="p-4 bg-card border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/doctor-avatar.jpg"
            alt="Dr. Ali Kamal"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">Dr. Ali Kamal</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg p-3 max-w-[80%]">
            <p className="text-sm">Hello! How can I help you today?</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Camera className="w-5 h-5" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;