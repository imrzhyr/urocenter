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
      logo: "/lovable-uploads/ea4de526-e37e-4348-acf0-c64cf182a493.png",
    },
    {
      id: "fib",
      name: "FIB",
      logo: "/lovable-uploads/baf5ed4f-4ba5-4618-8694-5d71249b817a.png",
    },
    {
      id: "qicard",
      name: "Qi Card",
      logo: "/lovable-uploads/2cb98755-7a98-43b1-b259-3e894b6d9bf3.png",
    },
    {
      id: "zaincash",
      name: "ZainCash",
      logo: "/lovable-uploads/292e06cf-9fcf-475a-9497-a045233f8b4d.png",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in">
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