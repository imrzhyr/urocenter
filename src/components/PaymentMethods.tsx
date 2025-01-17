import { PaymentMethod } from "./PaymentMethod";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onContinuePayment: () => void;
}

export const PaymentMethods = ({
  selectedMethod,
  onSelectMethod,
  onContinuePayment,
}: PaymentMethodsProps) => {
  const { t } = useLanguage();

  const paymentMethods = [
    {
      id: "qicard",
      name: t("Qi Card"),
      description: t("iraqi_electronic_payment"),
      logo: "/lovable-uploads/2cb98755-7a98-43b1-b259-3e894b6d9bf3.png",
    },
    {
      id: "fastpay",
      name: t("FastPay"),
      description: t("fast_digital_payments"),
      logo: "/lovable-uploads/ea4de526-e37e-4348-acf0-c64cf182a493.png",
    },
    {
      id: "fib",
      name: t("FIB"),
      description: t("first_iraqi_bank"),
      logo: "/lovable-uploads/baf5ed4f-4ba5-4618-8694-5d71249b817a.png",
    },
    {
      id: "zaincash",
      name: t("ZainCash"),
      description: t("mobile_wallet_zain"),
      logo: "/lovable-uploads/292e06cf-9fcf-475a-9497-a045233f8b4d.png",
    },
  ];

  return (
    <div className="space-y-3 animate-fade-in">
      {paymentMethods.map((method) => (
        <PaymentMethod
          key={method.id}
          id={method.id}
          name={method.name}
          description={method.description}
          logo={method.logo}
          selected={selectedMethod === method.id}
          onSelect={() => onSelectMethod(method.id)}
          onContinue={onContinuePayment}
        />
      ))}
    </div>
  );
};