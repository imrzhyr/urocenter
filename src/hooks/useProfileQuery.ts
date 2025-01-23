import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

const defaultProfile: Profile = {
  id: "",
  full_name: "",
  phone: "",
  gender: "",
  age: "",
  complaint: "",
  role: "patient",
  password: "",
  payment_status: "unpaid",
  payment_approval_status: "pending"
};

export const useProfileQuery = (phone?: string) => {
  return useQuery({
    queryKey: ["profile", phone],
    queryFn: async () => {
      if (!phone) return defaultProfile;

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("phone", phone)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return defaultProfile;
      }

      return data as Profile;
    },
    enabled: !!phone
  });
};