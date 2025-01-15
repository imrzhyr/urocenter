import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface CallButtonProps {
  recipientId: string;
  recipientName?: string;
}

export const CallButton = ({ recipientId, recipientName }: CallButtonProps) => {
  const { profile } = useProfile();

  const initiateCall = async () => {
    if (!profile?.id) return;

    try {
      const { data: call, error } = await supabase
        .from('calls')
        .insert({
          caller_id: profile.id,
          receiver_id: recipientId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Calling ${recipientName || 'user'}...`);
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error('Failed to initiate call');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white hover:bg-primary-foreground/10 h-8 w-8"
      onClick={initiateCall}
    >
      <Phone className="h-4 w-4" />
    </Button>
  );
};