import { LucideIcon } from "lucide-react";

interface DocumentTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const DocumentTypeCard = ({
  title,
  description,
  icon: Icon,
  color,
}: DocumentTypeCardProps) => {
  return (
    <div className="p-6 rounded-lg border border-border bg-card transition-colors">
      <div className="flex items-start space-x-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};