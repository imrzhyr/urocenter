import { useState, useEffect } from "react";
import { Profile } from "@/types/profile";
import { toast } from "sonner";

let profileState: Profile = {
  id: "",
  full_name: "",
  gender: "",
  age: "",
  complaint: "",
  phone: "",
  role: "patient",
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
    profileState = newState.profile;
    listeners.forEach(listener => listener(newState.profile));
  };

  return {
    profile,
    setState
  };
};