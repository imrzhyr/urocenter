import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  text: string;
  rating: number;
  location?: string;
}

export const TestimonialCard = ({ name, text, rating, location }: TestimonialCardProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg text-right border border-primary/10 hover:border-primary/20 transition-all duration-300">
      <div className="flex justify-end mb-2 gap-0.5">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-3 text-base font-arabic leading-relaxed">
        {text}
      </p>
      <div className="flex flex-col items-end gap-0.5">
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