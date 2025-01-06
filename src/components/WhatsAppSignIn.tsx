import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

export const WhatsAppSignIn = () => {
  const handleWhatsAppSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: '', // This will be handled by the phone input component
        channel: 'whatsapp'
      });
      
      if (error) throw error;
      toast.success("WhatsApp verification message sent!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Button 
      onClick={handleWhatsAppSignIn}
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
    >
      <MessageSquare className="w-5 h-5 text-green-600" />
      Continue with WhatsApp
    </Button>
  );
};