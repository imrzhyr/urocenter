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

let profileState: Profile | null = null;
let listeners: ((profile: Profile) => void)[] = [];

export const useProfileState = () => {
  const [profile, setProfile] = useState<Profile>(() => profileState || initialProfileState);

  useEffect(() => {
    listeners.push(setProfile);
    return () => {
      listeners = listeners.filter(listener => listener !== setProfile);
    };
  }, []);

  const setState = (newState: { profile: Profile }) => {
    profileState = newState.profile;
    listeners.forEach(listener => listener(profileState));
  };

  const clearState = () => {
    profileState = initialProfileState;
    listeners.forEach(listener => listener(profileState));
  };

  return {
    profile,
    setState,
    clearState
  };
};