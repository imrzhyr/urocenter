import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  isFromDoctor: boolean;
}

export const ChatMessage = ({ content, isFromDoctor }: ChatMessageProps) => {
  return (
    <div className={`flex ${isFromDoctor ? 'justify-start' : 'justify-end'} mb-4`}>
      {isFromDoctor && (
        <Avatar className="mr-2 h-8 w-8">
          <AvatarImage 
            src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png" 
            alt="Dr. Ali Kamal" 
          />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-2xl px-4 py-2 max-w-[80%] ${
          isFromDoctor
            ? 'bg-purple-50 text-purple-900'
            : 'bg-purple-600 text-white'
        }`}
      >
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
};