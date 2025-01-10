import { format, formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export const formatDate = (date: Date | string, pattern: string = 'PP', language: string = 'en') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, pattern, {
    locale: language === 'ar' ? ar : enUS
  });
};

export const formatRelativeTime = (date: Date | string, language: string = 'en') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: language === 'ar' ? ar : enUS
  });
};