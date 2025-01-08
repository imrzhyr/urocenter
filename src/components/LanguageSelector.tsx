import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative group">
          <span className="flex items-center gap-2">
            <img 
              src={language === 'en' ? 'https://flagcdn.com/w20/us.png' : 'https://flagcdn.com/w20/iq.png'} 
              alt={language === 'en' ? 'English' : 'العربية'} 
              className="w-5 h-4 object-cover"
            />
            {t('languages')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
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