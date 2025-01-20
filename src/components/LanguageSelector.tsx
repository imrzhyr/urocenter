import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative group h-8 px-2">
          <span className="text-sm">{language === 'en' ? 'English' : 'العربية'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[120px] bg-background">
        <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer h-8 text-sm">
          <img src="https://flagcdn.com/w20/us.png" alt="USA" className="w-4 h-3 mr-2" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ar')} className="cursor-pointer h-8 text-sm">
          <img src="https://flagcdn.com/w20/iq.png" alt="Iraq" className="w-4 h-3 mr-2" />
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};