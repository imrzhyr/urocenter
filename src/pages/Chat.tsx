import { useProfile } from "@/hooks/useProfile";
import { UserChatContainer } from "@/components/chat/UserChatContainer";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";
import { Bot } from "lucide-react";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";

const Chat = () => {
  const { profile } = useProfile();

  return (
    <div className="min-h-screen bg-background">
      <ExpandableChat
        size="lg"
        position="bottom-right"
        icon={<Bot className="h-6 w-6" />}
      >
        <ExpandableChatHeader>
          <h1 className="text-xl font-semibold">
            {profile?.role === 'admin' ? 'Doctor Chat' : 'Patient Chat'}
          </h1>
        </ExpandableChatHeader>
        <ExpandableChatBody>
          {profile?.role === 'admin' ? (
            <DoctorChatContainer />
          ) : (
            <UserChatContainer />
          )}
        </ExpandableChatBody>
      </ExpandableChat>
    </div>
  );
};

export default Chat;