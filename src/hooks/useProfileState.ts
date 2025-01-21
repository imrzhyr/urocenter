import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";

// Initialize with null values to indicate no profile is loaded yet
const initialProfileState: Profile = {
  id: "",
  full_name: "",
  gender: "",
  age: "",
  complaint: "",
  phone: "",
  role: undefined,
  payment_status: "unpaid",
  payment_approval_status: "pending",
  payment_method: undefined,
  payment_date: undefined
};

// Use sessionStorage to persist state within a tab but not across tabs
const getStoredProfile = (): Profile => {
  try {
    const stored = sessionStorage.getItem('profileState');
    return stored ? JSON.parse(stored) : initialProfileState;
  } catch {
    return initialProfileState;
  }
};

const setStoredProfile = (profile: Profile) => {
  try {
    sessionStorage.setItem('profileState', JSON.stringify(profile));
  } catch {
    // Ignore storage errors
  }
};

let listeners: ((profile: Profile) => void)[] = [];

export const useProfileState = () => {
  const [profile, setProfile] = useState<Profile>(getStoredProfile);

  useEffect(() => {
    listeners.push(setProfile);
    return () => {
      listeners = listeners.filter(listener => listener !== setProfile);
    };
  }, []);

  const setState = (newState: { profile: Profile }) => {
    setStoredProfile(newState.profile);
    listeners.forEach(listener => listener(newState.profile));
  };

  const clearState = () => {
    sessionStorage.removeItem('profileState');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userPassword');
    localStorage.removeItem('profileId');
    listeners.forEach(listener => listener(initialProfileState));
  };

  return {
    profile,
    setState,
    clearState
  };
};