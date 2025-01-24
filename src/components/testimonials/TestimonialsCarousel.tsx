import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TestimonialCard } from "./TestimonialCard";
import { testimonials } from "./testimonials-data";
import { cn } from "@/lib/utils";

export const TestimonialsCarousel = () => {
  const { language } = useLanguage();
  
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    direction: language === 'ar' ? 'rtl' : 'ltr',
  });

  return (
    <div className="w-full overflow-hidden">
      <div 
        ref={emblaRef} 
        className="overflow-hidden"
      >
        <div className={cn(
          "flex",
          language === 'ar' ? "flex-row-reverse" : "flex-row",
          "backface-visibility-hidden",
          "-ml-4 -mr-4"
        )}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] pl-4 pr-4"
            >
              <TestimonialCard {...testimonial} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};