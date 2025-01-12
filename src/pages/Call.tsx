import { useParams } from 'react-router-dom';
import { CallPage as CallPageComponent } from '@/components/call/CallPage';
import { IncomingCallDialog } from '@/components/call/IncomingCallDialog';

const Call = () => {
  const { userId } = useParams();

  if (!userId) return null;

  return (
    <>
      <CallPageComponent remoteUserId={userId} />
      <IncomingCallDialog callerId={userId} isOpen={false} />
    </>
  );
};

export default Call;