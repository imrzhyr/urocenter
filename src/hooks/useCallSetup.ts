import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./useProfile";
import { Call } from "@/types/call";
import { toast } from "sonner";

export const useCallSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();

  const initiateCall = async (receiverId: string) => {
    if (!profile?.id) {
      console.error("No profile ID found");
      toast.error("You must be logged in to make calls");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Initiating call with:", {
        caller_id: profile.id,
        receiver_id: receiverId
      });

      // Check if there's an active call
      const { data: existingCalls, error: checkError } = await supabase
        .from("calls")
        .select("*")
        .eq("is_active", true)
        .or(`caller_id.eq.${profile.id},receiver_id.eq.${profile.id}`);

      if (checkError) {
        console.error("Error checking existing calls:", checkError);
        throw checkError;
      }

      if (existingCalls && existingCalls.length > 0) {
        toast.error("You already have an active call");
        return;
      }

      // Create new call
      const { data: call, error: createError } = await supabase
        .from("calls")
        .insert([{
          caller_id: profile.id,
          receiver_id: receiverId,
          status: "initiated",
          call_type: "audio",
          is_active: true
        }])
        .select()
        .single();

      if (createError) {
        console.error("Error creating call:", createError);
        throw createError;
      }

      if (!call) {
        throw new Error("No call data returned");
      }

      console.log("Call created successfully:", call);

      // Subscribe to call updates
      const channel = supabase
        .channel(`call_${call.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'calls',
            filter: `id=eq.${call.id}`
          },
          (payload) => {
            console.log("Call status update received:", payload);
            const updatedCall = payload.new as Call;
            handleCallStatusChange(updatedCall);
          }
        )
        .subscribe();

      return call;
    } catch (error) {
      console.error("Error initiating call:", error);
      toast.error("Failed to initiate call");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallStatusChange = (call: Call) => {
    if (!profile?.id) return;

    const isReceiver = call.receiver_id === profile.id;
    const isCaller = call.caller_id === profile.id;

    switch (call.status) {
      case "ringing":
        if (isCaller) {
          toast("Ringing...");
        }
        break;
      case "connected":
        toast.success("Call connected");
        break;
      case "ended":
        toast("Call ended");
        break;
      case "missed":
        if (isCaller) {
          toast("Call not answered");
        }
        break;
      default:
        break;
    }
  };

  return {
    initiateCall,
    isLoading
  };
};