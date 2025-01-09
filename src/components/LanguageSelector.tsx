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
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative group">
          <Globe className="w-4 h-4 mr-2" />
          <span>{language === 'en' ? 'English - العربية' : 'العربية - English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-white">
        <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
          <img src="https://flagcdn.com/w20/us.png" alt="USA" className="w-5 h-4 mr-2" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ar')} className="cursor-pointer">
          <img src="https://flagcdn.com/w20/iq.png" alt="Iraq" className="w-5 h-4 mr-2" />
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};