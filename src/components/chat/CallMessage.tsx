import { Call } from "@/types/call";
import { format } from "date-fns";
import { formatDuration } from "@/utils/callUtils";
import { Phone, PhoneOff } from "lucide-react";

interface CallMessageProps {
  call: Call;
  callerName: string;
  receiverName: string;
}

export const CallMessage = ({ call, callerName, receiverName }: CallMessageProps) => {
  const getCallStatusMessage = () => {
    switch (call.status) {
      case 'ended':
        return `Call ended - Duration: ${formatDuration(call.duration || 0)}`;
      case 'rejected':
        return 'Call was rejected';
      case 'initiated':
        return 'Call was cancelled';
      case 'missed':
        return 'Call was missed';
      default:
        return 'Call attempt';
    }
  };

  const time = format(new Date(call.started_at || call.ended_at || ''), 'hh:mm a');

  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        {call.status === 'ended' ? (
          <Phone className="h-4 w-4" />
        ) : (
          <PhoneOff className="h-4 w-4" />
        )}
        <span>
          {`${callerName} called ${receiverName} - ${getCallStatusMessage()} (${time})`}
        </span>
      </div>
    </div>
  );
};