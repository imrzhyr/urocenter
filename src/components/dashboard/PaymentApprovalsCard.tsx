import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Profile } from "@/types/profile";

export const PaymentApprovalsCard = () => {
  const [pendingPayments, setPendingPayments] = useState<Profile[]>([]);
  const { t } = useLanguage();

  const fetchPendingPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('payment_status', 'unpaid')
        .eq('payment_approval_status', 'pending')
        .not('payment_method', 'is', null) // Only include users who have selected a payment method
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingPayments(data || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast.error(t('error_fetching_payments'));
    }
  };

  const handleApprovePayment = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          payment_status: 'paid',
          payment_approval_status: 'approved',
          payment_date: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      setPendingPayments(prev => prev.filter(payment => payment.id !== userId));
      toast.success(t('payment_approved'));
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error(t('error_approving_payment'));
    }
  };

  useEffect(() => {
    fetchPendingPayments();

    const channel = supabase
      .channel('payment_approvals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: "payment_status=eq.unpaid AND payment_approval_status=eq.pending"
        },
        (payload) => {
          console.log('Payment status change received:', payload);
          fetchPendingPayments();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (pendingPayments.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {t("Payment Approvals")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("No pending payment approvals")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        {t("Payment Approvals")}
      </h2>
      <div className="space-y-4">
        {pendingPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div>
              <p className="font-medium dark:text-white">
                {payment.full_name || payment.phone}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("Payment Method")}: {payment.payment_method}
              </p>
            </div>
            <Button
              onClick={() => handleApprovePayment(payment.id)}
              variant="default"
            >
              {t("Approve")}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};