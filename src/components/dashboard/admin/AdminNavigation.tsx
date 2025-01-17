import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, CreditCard, BarChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export const AdminNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-4 backdrop-blur-lg bg-opacity-80">
      <div className="container mx-auto max-w-lg">
        <nav className="grid grid-cols-3 gap-2 px-4">
          <Button
            variant={isActive("/admin/statistics") ? "default" : "ghost"}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 h-16 w-full transition-all rounded-xl",
              isActive("/admin/statistics") && "bg-primary hover:bg-primary/90"
            )}
            onClick={() => navigate("/admin/statistics")}
          >
            <BarChart className="h-5 w-5" />
            <span className="text-sm font-medium">{t("Statistics")}</span>
          </Button>
          
          <Button
            variant={isActive("/admin") ? "default" : "ghost"}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 h-16 w-full transition-all rounded-xl",
              isActive("/admin") ? "bg-primary hover:bg-primary/90" : "bg-primary/10 hover:bg-primary/20"
            )}
            onClick={() => navigate("/admin")}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm font-medium">{t("Messages")}</span>
          </Button>
          
          <Button
            variant={isActive("/admin/payments") ? "default" : "ghost"}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 h-16 w-full transition-all rounded-xl",
              isActive("/admin/payments") && "bg-primary hover:bg-primary/90"
            )}
            onClick={() => navigate("/admin/payments")}
          >
            <CreditCard className="h-5 w-5" />
            <span className="text-sm font-medium">{t("Payments")}</span>
          </Button>
        </nav>
      </div>
    </div>
  );
};