import { Star, StarHalf } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  text: string;
  rating: number;
  location?: string;
}

export const TestimonialCard = ({ name, text, rating, location }: TestimonialCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-primary/10 hover:border-primary/20 transition-all duration-300">
      <div className="flex justify-start mb-2 gap-0.5">
        {renderStars(rating)}
      </div>
      <p className="text-gray-700 dark:text-gray-200 mb-3 text-base font-arabic leading-relaxed text-left">
        {text}
      </p>
      <div className="flex flex-col items-start gap-0.5">
        <p className="text-primary font-semibold font-arabic text-sm">
          {name}
        </p>
        {location && (
          <p className="text-muted-foreground text-xs font-arabic">
            {location}
          </p>
        )}
      </div>
    </div>
  );
};