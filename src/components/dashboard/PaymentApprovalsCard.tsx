import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface PendingPayment {
  id: string;
  full_name: string | null;
  phone: string | null;
  payment_status: string | null;
  payment_approval_status: string | null;
}

export const PaymentApprovalsCard = () => {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const { t } = useLanguage();
  const { toast } = useToast();

  const fetchPendingPayments = async () => {
    console.log('Fetching pending payments...');
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, payment_status, payment_approval_status')
      .eq('payment_status', 'unpaid')
      .eq('payment_approval_status', 'pending')
      .eq('role', 'patient')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending payments:', error);
      return;
    }

    console.log('Pending payments fetched:', data);
    setPendingPayments(data || []);
  };

  useEffect(() => {
    // Enable real-time updates for the profiles table
    console.log('Setting up real-time subscription for payment approvals...');
    const channel = supabase
      .channel('payment_approvals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: "payment_status=eq.unpaid AND payment_approval_status=eq.pending AND role=eq.patient"
        },
        (payload) => {
          console.log('Payment approval change received:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Add new pending payment to the list
            const newPayment = payload.new as PendingPayment;
            setPendingPayments(prev => [newPayment, ...prev]);
          } else if (payload.eventType === 'DELETE' || payload.eventType === 'UPDATE') {
            // Remove or update the payment in the list
            setPendingPayments(prev => 
              prev.filter(payment => payment.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    // Initial fetch
    fetchPendingPayments();

    return () => {
      console.log('Cleaning up payment approvals subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprovePayment = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        payment_status: 'paid',
        payment_approval_status: 'approved',
        payment_date: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      toast({
        title: t("Error"),
        description: t("Failed to approve payment"),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("Success"),
      description: t("Payment approved successfully"),
    });

    // The real-time subscription will handle removing this item from the list
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Payment Approvals")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingPayments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("No pending payment approvals")}
            </p>
          ) : (
            <div className="grid gap-4">
              {pendingPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border dark:border-gray-800"
                >
                  <div>
                    <p className="font-medium">{payment.full_name || t("Unknown User")}</p>
                    <p className="text-sm text-muted-foreground">{payment.phone}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleApprovePayment(payment.id)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {t("Approve")}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};