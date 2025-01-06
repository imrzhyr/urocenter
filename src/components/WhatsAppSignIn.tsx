import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export const WhatsAppSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleWhatsAppSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        phone: '+9647702428154', // This is just for testing
      });
      
      if (error) throw error;
      toast.success("Verification message sent!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleWhatsAppSignIn}
      variant="outline" 
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50"
    >
      <MessageSquare className="w-5 h-5 text-green-600" />
      {isLoading ? "Sending..." : "Continue with WhatsApp"}
    </Button>
  );
};