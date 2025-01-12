import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { startCall } from '@/features/call/NewCallSystem';

interface CallButtonProps {
  userId: string;
}

export const CallButton = ({ userId }: CallButtonProps) => {
  return (
    <Button
      onClick={() => startCall(userId)}
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
    >
      <Phone className="h-5 w-5" />
    </Button>
  );
};