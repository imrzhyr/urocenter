import { useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const TestCallComponent = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile?.id) return;

    // Get admin profile first
    const getAdminAndCall = async () => {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .single();

      if (!adminProfile) {
        console.error('No admin profile found');
        return;
      }

      // Wait 3 seconds before initiating the call
      const timer = setTimeout(async () => {
        console.log('Initiating test call from admin to user');
        
        const { data: call, error } = await supabase
          .from('calls')
          .insert({
            caller_id: adminProfile.id,
            receiver_id: profile.id,
            status: 'initiated'
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating test call:', error);
          return;
        }

        console.log('Test call created:', call);
      }, 3000);

      return () => clearTimeout(timer);
    };

    getAdminAndCall();
  }, [profile?.id]);

  return null;
};