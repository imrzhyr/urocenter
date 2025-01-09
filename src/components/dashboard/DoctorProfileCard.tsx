import { MapPin, Clock, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DoctorProfileCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('clinic_info')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium">{t('clinic_location')}</h4>
              <p className="text-sm text-muted-foreground">{t('clinic_info')}</p>
              <a 
                href="https://maps.google.com/?q=35.561398,45.450352"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                {t('view_on_map')}
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Phone className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium">{t('phone_numbers')}</h4>
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
              <h4 className="font-medium">{t('work_hours')}</h4>
              <p className="text-sm text-muted-foreground">{t('work_hours_detail')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};