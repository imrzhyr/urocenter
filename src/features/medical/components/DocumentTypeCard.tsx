import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DocumentTypeCardProps {
  title: string;
  description: string;
}

export const DocumentTypeCard = ({ title, description }: DocumentTypeCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};