import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanInfo } from "framer-motion";
import { messageSound } from "@/utils/audioUtils";
import { useProfile } from "@/hooks/useProfile";
import { MessageItem } from "./message/MessageItem";
import { supabase } from "@/integrations/supabase/client";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { format } from "date-fns";

interface Call {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onReply?: (message: Message | null) => void;
  replyingTo?: Message | null;
}

export const MessageList = ({ messages, currentUserId, onReply }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const { profile } = useProfile();
  const [calls, setCalls] = useState<Call[]>([]);
  
  useEffect(() => {
    const fetchCalls = async () => {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .or(`caller_id.eq.${profile?.id},receiver_id.eq.${profile?.id}`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setCalls(data);
      }
    };

    fetchCalls();

    const channel = supabase
      .channel('calls_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'calls' 
      }, () => {
        fetchCalls();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profile?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    if (messages.length > prevMessagesLength.current) {
      messageSound.play();
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const handleDragEnd = async (message: Message, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      onReply?.(message);
    }
  };

  const isFromCurrentUser = (message: Message) => {
    if (profile?.role === 'admin') {
      return message.is_from_doctor;
    }
    return !message.is_from_doctor;
  };

  const getCallIcon = (call: Call) => {
    const isCaller = call.caller_id === profile?.id;
    
    if (call.status === 'missed') {
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    }
    
    if (isCaller) {
      return <PhoneOutgoing className="h-4 w-4 text-blue-500" />;
    }
    
    return <PhoneIncoming className="h-4 w-4 text-green-500" />;
  };

  const getCallDuration = (call: Call) => {
    if (!call.started_at || !call.ended_at) return null;
    const duration = new Date(call.ended_at).getTime() - new Date(call.started_at).getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Merge messages and calls into a single timeline
  const timeline = [...messages, ...calls.map(call => ({
    id: call.id,
    type: 'call',
    created_at: call.created_at,
    call
  }))].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <ScrollArea className="h-full chat-background">
      <div className="flex flex-col space-y-2 py-4 px-2 sm:px-4 min-h-full w-full overflow-x-hidden">
        {timeline.map((item) => (
          'type' in item && item.type === 'call' ? (
            <div key={item.id} className="flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg text-sm">
                {getCallIcon(item.call)}
                <span className="text-gray-600 dark:text-gray-300">
                  {format(new Date(item.call.created_at), 'MMM d, HH:mm')}
                </span>
                {getCallDuration(item.call) && (
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    {getCallDuration(item.call)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <MessageItem
              key={item.id}
              message={item}
              fromCurrentUser={isFromCurrentUser(item)}
              onDragEnd={handleDragEnd}
            />
          )
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};