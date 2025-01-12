import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { toggleMute, endCall } from '@/features/call/NewCallSystem';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDuration } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface CallPageProps {
  remoteUserId: string;
}

export const CallPage = ({ remoteUserId }: CallPageProps) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [remoteProfile, setRemoteProfile] = useState<any>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchRemoteProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', remoteUserId)
        .single();
      
      if (data) {
        setRemoteProfile(data);
      }
    };

    if (remoteUserId) {
      fetchRemoteProfile();
    }

    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remoteUserId]);

  const handleToggleMute = () => {
    toggleMute();
    setIsMuted(!isMuted);
  };

  if (!remoteProfile) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <audio id="remoteAudio" autoPlay />
      
      <Avatar className="h-32 w-32 mb-6">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback>{remoteProfile.full_name?.[0]}</AvatarFallback>
      </Avatar>

      <h2 className="text-2xl font-semibold mb-2">{remoteProfile.full_name}</h2>
      <p className="text-gray-400 mb-8">
        {formatDuration({ seconds: duration })}
      </p>

      <div className="flex space-x-4">
        <Button
          onClick={handleToggleMute}
          variant="ghost"
          className="rounded-full p-6 hover:bg-gray-800"
        >
          {isMuted ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        <Button
          onClick={endCall}
          variant="destructive"
          className="rounded-full p-6"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};