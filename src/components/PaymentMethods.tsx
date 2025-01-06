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
      logo: "https://fastpay.iq/wp-content/uploads/2023/05/fastpay-logo.png",
    },
    {
      id: "zaincash",
      name: "ZainCash",
      logo: "https://zaincash.iq/wp-content/uploads/2023/01/zaincash-logo.png",
    },
    {
      id: "fib",
      name: "FIB",
      logo: "https://fib.iq/wp-content/uploads/2022/12/fib-logo.png",
    },
    {
      id: "qicard",
      name: "Qi Card",
      logo: "https://qi.iq/wp-content/uploads/2023/04/qi-logo.png",
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