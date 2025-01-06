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
      logo: "https://play-lh.googleusercontent.com/jfe6HM11XAMvkGtHgnYqExKPZEf8DcZ9bG9KJ-xt_pU9e8Jl2K-7M8ZYhxKUHhhnLQ=w240-h480-rw",
    },
    {
      id: "zaincash",
      name: "ZainCash",
      logo: "https://www.zaincash.iq/images/logo.png",
    },
    {
      id: "fib",
      name: "FIB",
      logo: "https://fib.iq/wp-content/uploads/2022/12/fib-logo.png",
    },
    {
      id: "qicard",
      name: "Qi Card",
      logo: "https://www.qi.iq/assets/images/qi-logo.png",
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