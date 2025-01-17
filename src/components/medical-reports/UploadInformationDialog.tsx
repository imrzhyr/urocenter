import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const UploadInformationDialog = () => {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent"
        >
          <Info className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("upload_information")}</DialogTitle>
          <DialogDescription className="space-y-4">
            <p>{t("drag_drop")}</p>
            <p>
              {t("or")} <span className="text-primary">{t("browse")}</span>{" "}
              {t("to_upload")}
            </p>
            <div className="text-sm text-muted-foreground">
              <p>{t("max_file_size")}</p>
              <p>{t("supported_formats")}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};