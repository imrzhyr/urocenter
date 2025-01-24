import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { testimonials as staticTestimonials } from '@/components/testimonials/testimonials-data';

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  location: string;
  date_ar: string;
  date_en: string;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    // Use the static testimonials data
    setTestimonials(staticTestimonials);
  }, [language]); // Still refetch when language changes

  return { testimonials };
} 