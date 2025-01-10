import { format, isToday, isYesterday } from "date-fns";
import { ar } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

interface DateSeparatorProps {
  date: Date;
}

export const DateSeparator = ({ date }: DateSeparatorProps) => {
  const { language } = useLanguage();

  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) {
      return language === 'ar' ? 'اليوم' : 'Today';
    }
    if (isYesterday(date)) {
      return language === 'ar' ? 'أمس' : 'Yesterday';
    }
    return format(date, 'MMMM d, yyyy', { locale: language === 'ar' ? ar : undefined });
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-1">
        <span className="text-xs text-gray-600 dark:text-gray-300">
          {formatDateSeparator(date)}
        </span>
      </div>
    </div>
  );
};