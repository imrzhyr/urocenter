import { useProfileContext } from '@/contexts/ProfileContext';
import { Profile } from '@/types/profile';

export const useProfileState = () => {
  const { profile, setProfile } = useProfileContext();

  const setState = (newState: { profile: Profile }) => {
    setProfile(newState.profile);
  };

  return {
    profile,
    setState
  };
};