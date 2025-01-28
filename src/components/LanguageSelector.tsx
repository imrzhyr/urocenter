import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-[32px] min-w-0 px-3 text-[15px] font-medium rounded-lg bg-white dark:bg-gray-900 border border-[#3C3C43]/20 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all duration-200"
        >
          {language === 'en' ? 'EN' : 'عر'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        alignOffset={-24}
        className="min-w-[80px] p-1 mx-6 bg-white dark:bg-gray-900 border border-[#3C3C43]/20 dark:border-white/10 shadow-lg transition-all duration-200"
      >
        <DropdownMenuItem 
          onClick={() => setLanguage('en')} 
          className="h-[32px] px-3 text-[15px] cursor-pointer rounded-md flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <span>English</span>
          {language === 'en' && <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] dark:bg-[#0A84FF] ml-3" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('ar')} 
          className="h-[32px] px-3 text-[15px] cursor-pointer rounded-md flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <span>العربية</span>
          {language === 'ar' && <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF] dark:bg-[#0A84FF] ml-3" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};