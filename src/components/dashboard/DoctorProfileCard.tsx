import { MapPin, Clock, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DoctorProfileCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img
            src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png"
            alt="Dr. Ali Kamal"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">Dr. Ali Kamal</h2>
            <p className="text-sm text-muted-foreground">Urologist Consultant & Surgeon</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Clinic Location</h4>
              <p className="text-sm text-muted-foreground">
                Sulaymaniyah - Ibrahim Pasha Street - Opposite Sherko Printing & Advertising - Aran Building - Second Floor
              </p>
              <a 
                href="https://maps.google.com/?q=35.561398,45.450352"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                View on Map
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Phone className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Phone Numbers</h4>
              <p className="text-sm text-muted-foreground">07729996924</p>
              <p className="text-sm text-muted-foreground">07705449905</p>
              <p className="text-sm text-muted-foreground">07705486036</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Working Hours</h4>
              <p className="text-sm text-muted-foreground">2:00 PM - 6:00 PM (Closed on Fridays)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};