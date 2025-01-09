import { useProfileState } from "./useProfileState";
import { useProfileActions } from "./useProfileActions";
import { useProfileQuery } from "./useProfileQuery";

export const useProfile = () => {
  const { profile } = useProfileState();
  const { updateProfile } = useProfileActions();
  const { isLoading, refetch } = useProfileQuery();

  return {
    profile,
    isLoading,
    updateProfile,
    refetch
  };
};