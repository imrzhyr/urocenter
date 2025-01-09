import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const phone = session?.session?.user?.phone;

        if (!phone) {
          setIsLoading(false);
          return;
        }

        console.log('Fetching profile for phone:', phone);
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('phone', phone)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsLoading(false);
          return;
        }

        console.log('Profile data fetched:', profileData);
        setProfile(profileData);
      } catch (error) {
        console.error('Error in fetchProfile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();

    const channel = supabase
      .channel('profile_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles' 
        }, 
        fetchProfile
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { profile, isLoading };
};