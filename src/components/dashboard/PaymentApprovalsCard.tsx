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
      console.log('Fetching pending payments...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('payment_status', 'unpaid')
        .eq('payment_approval_status', 'pending')
        .not('payment_method', 'is', null);

      if (error) {
        console.error('Error fetching pending payments:', error);
        throw error;
      }

      console.log('Pending payments data:', data);
      setPendingPayments(data || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      toast.error(t('error_fetching_payments'));
    }
  };

  const handleApprovePayment = async (userId: string) => {
    try {
      console.log('Approving payment for user:', userId);
      const { error } = await supabase
        .from('profiles')
        .update({
          payment_status: 'paid',
          payment_approval_status: 'approved',
          payment_date: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error approving payment:', error);
        throw error;
      }

      console.log('Payment approved successfully');
      setPendingPayments(prev => prev.filter(payment => payment.id !== userId));
      toast.success(t('payment_approved'));
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error(t('error_approving_payment'));
    }
  };

  useEffect(() => {
    fetchPendingPayments(); // Initial fetch

    // Set up polling interval
    const pollingInterval = setInterval(() => {
      console.log('Polling for new pending payments...');
      fetchPendingPayments();
    }, 3000); // Poll every 3 seconds

    // Set up real-time subscription
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
      console.log('Cleaning up payment approvals subscription and polling...');
      clearInterval(pollingInterval);
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
                {payment.phone}
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