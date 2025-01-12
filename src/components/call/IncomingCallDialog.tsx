import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff } from 'lucide-react';
import { acceptCall, rejectCall } from '@/features/call/NewCallSystem';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IncomingCallDialogProps {
  callerId: string;
  isOpen: boolean;
}

export const IncomingCallDialog = ({ callerId, isOpen }: IncomingCallDialogProps) => {
  const [callerProfile, setCallerProfile] = useState<any>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchCallerProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', callerId)
        .single();
      
      if (data) {
        setCallerProfile(data);
      }
    };

    if (callerId) {
      fetchCallerProfile();
    }
  }, [callerId]);

  if (!callerProfile) return null;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4 py-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{callerProfile.full_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{callerProfile.full_name}</h3>
            <p className="text-sm text-gray-500">Incoming call...</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={rejectCall}
              variant="destructive"
              className="rounded-full p-6"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
            <Button
              onClick={acceptCall}
              className="bg-green-500 hover:bg-green-600 rounded-full p-6"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};