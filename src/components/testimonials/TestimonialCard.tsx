import { Star, StarHalf, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestimonialCardProps {
  name: string;
  text: string;
  rating: number;
  location?: string;
  index?: number;
}

export const TestimonialCard = ({ name, text, rating, location, index = 0 }: TestimonialCardProps) => {
  const { t, language } = useLanguage();
  
  const getRandomDate = (index: number) => {
    // Base date: February 1, 2025
    const baseDate = new Date('2025-02-01').getTime();
    
    // Random number of days between 0 and 60 (2 months)
    const randomDays = Math.floor(Math.random() * 60);
    
    // Add some variance based on the index to spread out the dates
    const indexVariance = (index * 3) % 15; // Creates a cycle of 0-14 days
    
    // Combine random days and index variance
    const totalDays = (randomDays + indexVariance) % 60; // Keep within 60 days
    
    const date = new Date(baseDate + totalDays * 24 * 60 * 60 * 1000);
    
    const formatter = new Intl.DateTimeFormat(language === 'ar' ? 'ar-IQ' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return formatter.format(date);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-[#FF9500] dark:text-[#FFD60A]" fill="currentColor" />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 text-[#FF9500] dark:text-[#FFD60A]" fill="currentColor" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "w-full",
        "p-4",
        "bg-white dark:bg-gray-900",
        "rounded-2xl",
        "shadow-lg shadow-black/5",
        "border border-gray-100 dark:border-gray-800",
        "space-y-4",
        "hover:border-[#007AFF] dark:hover:border-[#0A84FF]",
        "transition-all duration-200"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0",
          "w-10 h-10",
          "rounded-xl",
          "flex items-center justify-center",
          "bg-[#007AFF]/10 dark:bg-[#0A84FF]/10"
        )}>
          <span className="text-[15px] font-semibold text-[#007AFF] dark:text-[#0A84FF]">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-medium text-[#1C1C1E] dark:text-white truncate">
              {name}
            </p>
            <BadgeCheck className="w-4 h-4 flex-shrink-0 text-[#34C759] dark:text-[#30D158]" fill="currentColor" />
          </div>
          {location && (
            <p className="text-[13px] text-[#8E8E93] dark:text-[#98989D] truncate">
              {t("testimonial_from")} {location}
            </p>
          )}
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-[#1C1C1E] dark:text-white line-clamp-3">
        {text}
      </p>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1">
          {renderStars(rating)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
            {getRandomDate(index)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};