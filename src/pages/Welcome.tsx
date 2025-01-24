import { useNavigate } from "react-router-dom";
import { Stethoscope, MessageCircle, Star, ChevronRight, BadgeCheck, Globe, Check } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";
import { LanguageSelector } from "@/components/LanguageSelector";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion as framerMotion, useMotionValue, useTransform, animate, useAnimation } from "framer-motion";
import { useTestimonials } from "@/hooks/useTestimonials";
import useEmblaCarousel from 'embla-carousel-react';
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Welcome = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { testimonials } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "center",
      direction: language === 'ar' ? 'rtl' : 'ltr',
      dragFree: false,
      containScroll: "trimSnaps",
      watchDrag: true,
      skipSnaps: false
    }
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Autoplay with smooth scrolling
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext(true);
      } else {
        emblaApi.scrollTo(0, true);
      }
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const features = [
    {
      icon: <Stethoscope className="w-5 h-5 text-white" />,
      title: t("expert_care"),
      description: t("specialized_treatment"),
      gradient: "from-[#34C759] to-[#30D158]"
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-white" />,
      title: t("direct_communication"),
      description: t("connect_with_doctor"),
      gradient: "from-[#007AFF] to-[#0A84FF]"
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-[#FF9500] dark:text-[#FFD60A]" fill="currentColor" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-[#FF9500] dark:text-[#FFD60A]" fill="currentColor" strokeWidth={3} />
      );
    }

    return stars;
  };

  const selectLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  return (
    <div className="relative min-h-screen bg-[#000B1D] overflow-hidden">
      {/* Language Selector */}
      <div className="absolute top-8 right-8 z-30">
        <button
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="p-3 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.08] text-white/80 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
        >
          <Globe className="w-5 h-5" />
        </button>

        {showLanguageMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden min-w-[160px] shadow-xl"
          >
            <button
              onClick={() => selectLanguage('en')}
              className="w-full px-4 py-3 text-left text-[15px] text-white/90 hover:bg-white/[0.08] flex items-center justify-between"
            >
              English
              {language === 'en' && <Check className="w-4 h-4 text-[#0A84FF]" />}
            </button>
            <div className="h-[1px] bg-white/[0.08]" />
            <button
              onClick={() => selectLanguage('ar')}
              className="w-full px-4 py-3 text-right text-[15px] text-white/90 hover:bg-white/[0.08] flex items-center justify-between font-arabic"
            >
              العربية
              {language === 'ar' && <Check className="w-4 h-4 text-[#0A84FF]" />}
            </button>
          </motion.div>
        )}
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[50vh] flex items-center justify-center"
      >
        <HeroGeometric
          title1={language === 'ar' ? 'د. علي كمال' : 'Dr. Ali Kamal'}
          title2={language === 'ar' ? 'استشاري المسالك البولية' : 'Consultant Urologist'}
        />
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative px-6 pb-24 -mt-20"
      >
        <div className="max-w-screen-md mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-2xl font-semibold mb-8 bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent"
          >
            {language === 'ar' ? 'قصص نجاح من مرضانا' : 'Success stories from our care'}
          </motion.h3>

          <div className="embla relative">
            <div className="embla__viewport overflow-hidden" ref={emblaRef}>
              <div className="embla__container flex touch-pan-y">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="embla__slide flex-[0_0_100%] min-w-0 pl-4 pr-4"
                  >
                    <div className={`
                      p-6 rounded-2xl
                      bg-white/[0.08] backdrop-blur-xl
                      border border-white/[0.08]
                      transform transition-all duration-300
                      ${currentIndex === index ? 'scale-100' : 'scale-95 opacity-70'}
                    `}>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating ? 'text-[#0A84FF]' : 'text-white/20'}`}
                            fill={i < testimonial.rating ? '#0A84FF' : 'none'}
                          />
                        ))}
                      </div>
                      <p className={`text-white/80 text-lg mb-4 ${language === 'ar' ? 'font-arabic text-right' : ''}`}>
                        {testimonial.text}
                      </p>
                      <div className={`flex items-center justify-between text-sm text-white/60 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        <span>{testimonial.name}</span>
                        <span>{language === 'ar' ? testimonial.date_ar : testimonial.date_en}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-[-2rem] left-0 right-0">
              <div className="flex justify-center items-center gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${currentIndex === index 
                        ? 'bg-[#0A84FF] w-4' 
                        : 'bg-white/20 hover:bg-white/30'
                      }
                    `}
                    onClick={() => emblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sign In and Create Account */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4"
      >
        <button
          onClick={() => navigate('/signup')}
          className={`
            w-[280px] px-8 py-3.5 rounded-2xl text-white font-medium text-[17px]
            bg-[#0A84FF] hover:bg-[#0070E2] active:bg-[#0063C9]
            transform transition-all duration-200
            shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_1px_1px_0_rgba(0,0,0,0.05)]
            active:scale-[0.97]
            backdrop-blur-sm
            ${language === 'ar' ? 'font-arabic' : ''}
          `}
        >
          {language === 'ar' ? 'ابدأ رحلتك الطبية' : 'Start your medical journey'}
        </button>

        <button
          onClick={() => navigate('/signin')}
          className={`
            w-[280px] px-8 py-3.5 rounded-2xl font-medium text-[17px]
            bg-white/[0.08] hover:bg-white/[0.12] active:bg-white/[0.16]
            text-white
            transform transition-all duration-200
            shadow-[0_0_0_1px_rgba(255,255,255,0.1)]
            active:scale-[0.97]
            backdrop-blur-md
            ${language === 'ar' ? 'font-arabic' : ''}
          `}
        >
          {language === 'ar' ? 'لديك حساب؟ تسجيل الدخول' : 'Have an account? Sign in'}
        </button>
      </motion.div>
    </div>
  );
};

export default Welcome;