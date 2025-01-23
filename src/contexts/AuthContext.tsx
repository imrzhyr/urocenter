import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { toast } from 'sonner';

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profileId = localStorage.getItem('profileId');
      const userPhone = localStorage.getItem('userPhone');

      if (!profileId && !userPhone) {
        setIsLoading(false);
        return;
      }

      let query = supabase.from('profiles').select('*');
      
      if (profileId) {
        query = query.eq('id', profileId);
      } else if (userPhone) {
        const formattedPhone = userPhone.startsWith('+') ? userPhone : `+${userPhone}`;
        query = query.eq('phone', formattedPhone);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        // Ensure profileId is stored in localStorage immediately when we get the data
        localStorage.setItem('profileId', data.id);
        setProfile(data);
        
        // Log the profile data being set
        console.log('Profile data set in context:', data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial profile fetch
  useEffect(() => {
    fetchProfile();
  }, []);

  // Set up real-time subscription for profile updates
  useEffect(() => {
    if (profile?.id) {
      const channel = supabase
        .channel(`profile_${profile.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${profile.id}`
          },
          () => {
            fetchProfile();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.id]);

  const value = {
    profile,
    isLoading,
    refetchProfile: fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};