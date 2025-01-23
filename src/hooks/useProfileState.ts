import { create } from 'zustand';
import type { Profile } from '@/types/profile';

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  clearState: () => void;
  setState: (state: Partial<ProfileState>) => void;
}

export const useProfileState = create<ProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  updateProfile: (updates) => 
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null
    })),
  clearState: () => set({ profile: null }),
  setState: (newState) => set(newState)
}));