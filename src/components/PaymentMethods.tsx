import { PaymentMethod } from "./PaymentMethod";

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export const PaymentMethods = ({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodsProps) => {
  const paymentMethods = [
    {
      id: "fastpay",
      name: "FastPay",
      logo: "/payment-logos/fastpay.png",
    },
    {
      id: "zaincash",
      name: "ZainCash",
      logo: "/payment-logos/zaincash.png",
    },
    {
      id: "fib",
      name: "FIB",
      logo: "/payment-logos/fib.png",
    },
    {
      id: "qicard",
      name: "Qi Card",
      logo: "/payment-logos/qicard.png",
    },
  ];

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <PaymentMethod
          key={method.id}
          {...method}
          selected={selectedMethod === method.id}
          onSelect={() => onSelectMethod(method.id)}
        />
      ))}
    </div>
  );
};