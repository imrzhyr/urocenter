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
      logo: "https://play-lh.googleusercontent.com/TIc_uYoFJaXO6Qy9-qPMLN1HtXUqkDOkBwVbfl9pDxvnZMRHZm5Iu6gV5SLR2ZV6Yw=w240-h480-rw",
    },
    {
      id: "zaincash",
      name: "ZainCash",
      logo: "https://play-lh.googleusercontent.com/FvG7-sFDHvhHy-qGk8VGz6fb6yr4T5lGv7zR8fVqZGVhkNnHcZG6ndXwJcHFrBGkEA=w240-h480-rw",
    },
    {
      id: "fib",
      name: "FIB",
      logo: "https://fib.iq/wp-content/uploads/2022/12/fib-logo.png",
    },
    {
      id: "qicard",
      name: "Qi Card",
      logo: "https://play-lh.googleusercontent.com/mMNL4Ld_Pc_Kd0XEz_rGsqGQVvgbmxQyLOJDJCxeqSTwOgiCQGLFGGLGhFIJpvA_Yw=w240-h480-rw",
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