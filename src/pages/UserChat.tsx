import { useParams } from 'react-router-dom';
import { DoctorChatContainer } from '@/components/chat/doctor/DoctorChatContainer';
import { useProfile } from '@/hooks/useProfile';

const UserChat = () => {
  const { userId } = useParams();
  const { profile } = useProfile();

  if (!userId) {
    return <div>No user ID provided</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {profile?.role === 'admin' ? (
        <DoctorChatContainer />
      ) : (
        <div>Access denied</div>
      )}
    </div>
  );
};

export default UserChat;