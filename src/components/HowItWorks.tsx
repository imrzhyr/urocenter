import { ClipboardList, CreditCard, MessageCircle, UserCircle2 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: "Fill Information",
      description: "Complete your medical profile and history",
    },
    {
      icon: CreditCard,
      title: "Make Payment",
      description: "Secure payment through multiple options",
    },
    {
      icon: MessageCircle,
      title: "Consult Doctor",
      description: "Chat, call, or video consult with Dr. Ali",
    },
    {
      icon: UserCircle2,
      title: "Follow Up",
      description: "Get continuous care and support",
    },
  ];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <step.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground text-center">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};