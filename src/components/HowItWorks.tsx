import { ClipboardList, CreditCard, MessageCircle, UserCircle2 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: "Fill Information",
      description: "Complete your medical profile",
    },
    {
      icon: CreditCard,
      title: "Make Payment",
      description: "Multiple payment options",
    },
    {
      icon: MessageCircle,
      title: "Consult Doctor",
      description: "Chat, call, or video consult",
    },
    {
      icon: UserCircle2,
      title: "Follow Up",
      description: "Get continuous care",
    },
  ];

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">How It Works</h2>
      <div className="grid grid-cols-2 gap-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col items-center p-3 bg-card rounded-lg shadow-sm animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="text-xs text-muted-foreground text-center">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};