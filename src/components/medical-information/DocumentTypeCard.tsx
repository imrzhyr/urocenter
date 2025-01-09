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
    <div className="p-4 rounded-lg border border-border bg-card transition-colors h-full">
      <div className="flex flex-col space-y-3">
        <div className={`p-2 rounded-lg ${color} w-fit`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium text-sm mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
};