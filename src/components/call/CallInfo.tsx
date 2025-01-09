import { CallAvatar } from "./CallAvatar";
import { CallingUser } from "@/types/call";

interface CallInfoProps {
  callingUser: CallingUser | null;
  callStatus: string;
  isIncoming: boolean;
}

export const CallInfo = ({ callingUser, callStatus, isIncoming }: CallInfoProps) => {
  return (
    <div className="text-center mb-12">
      <CallAvatar 
        name={callingUser?.full_name || ''} 
        isRinging={callStatus === 'ringing'} 
      />
      <h2 className="text-xl font-semibold mb-2">{callingUser?.full_name}</h2>
      <p className="text-gray-500">
        {callStatus === 'ringing' && (isIncoming ? 'Incoming call...' : 'Calling...')}
        {callStatus === 'connected' && 'In call'}
        {callStatus === 'ended' && 'Call ended'}
      </p>
    </div>
  );
};