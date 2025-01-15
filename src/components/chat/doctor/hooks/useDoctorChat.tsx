import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Profile } from "@/types/profile";
import { useProfile } from "@/hooks/useProfile";

export const useDoctorChat = (userId?: string) => {
  const navigate = useNavigate();
  const [patientProfile, setPatientProfile] = useState<Profile | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchPatientInfo = async () => {
      if (!userId) {
        console.log("No patient ID provided");
        return;
      }

      try {
        console.log('Fetching patient info for ID:', userId);
        const { data: patientData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching patient info:", error);
          toast.error("Could not load patient information");
          navigate("/admin");
          return;
        }

        if (!patientData) {
          console.error("No patient found with ID:", userId);
          toast.error("Patient not found");
          navigate("/admin");
          return;
        }

        if (profile?.role !== 'admin') {
          console.error("Non-admin user attempting to access doctor chat");
          toast.error("Unauthorized access");
          navigate("/dashboard");
          return;
        }

        if (userId === profile?.id) {
          console.error("Cannot chat with self");
          toast.error("Cannot chat with yourself");
          navigate("/admin");
          return;
        }

        console.log('Patient profile found:', patientData);
        setPatientProfile(patientData);
      } catch (error) {
        console.error("Error in fetchPatientInfo:", error);
        toast.error("Could not load patient information");
        navigate("/admin");
      }
    };

    fetchPatientInfo();
  }, [userId, navigate, profile?.id, profile?.role]);

  return { patientProfile };
};