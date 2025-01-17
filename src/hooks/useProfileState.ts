import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";

let profileState: Profile = {
  id: "",
  full_name: "",
  gender: "",
  age: "",
  complaint: "",
  phone: "",
  role: "patient",
  payment_status: "unpaid",
  payment_approval_status: "pending"
};

let listeners: ((profile: Profile) => void)[] = [];

export const useProfileState = () => {
  const [profile, setProfile] = useState<Profile>(profileState);

  useEffect(() => {
    listeners.push(setProfile);
    return () => {
      listeners = listeners.filter(listener => listener !== setProfile);
    };
  }, []);

  const setState = (newState: { profile: Profile }) => {
    profileState = {
      ...profileState,
      ...newState.profile
    };
    listeners.forEach(listener => listener(profileState));
  };

  return {
    profile,
    setState
  };
};