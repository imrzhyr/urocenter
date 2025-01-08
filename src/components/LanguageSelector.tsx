import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState('en');

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.className = lang === 'ar' ? 'font-arabic' : '';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Languages className="w-5 h-5" />
          <span className="sr-only">Change Language</span>
          <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            Languages
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="cursor-pointer">
          <img src="https://flagcdn.com/w20/us.png" alt="USA" className="w-4 h-4 mr-2" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('ar')} className="cursor-pointer">
          <img src="https://flagcdn.com/w20/iq.png" alt="Iraq" className="w-4 h-4 mr-2" />
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};