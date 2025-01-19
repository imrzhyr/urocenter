import { useNavigate } from "react-router-dom";
import { Stethoscope, MessageCircle } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials/TestimonialsCarousel";
import { LanguageSelector } from "@/components/LanguageSelector";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AuroraBackground } from "@/components/ui/aurora-background";

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Stethoscope className="w-5 h-5 text-primary" />,
      title: t("expert_care"),
      description: t("specialized_treatment"),
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-primary" />,
      title: t("direct_communication"),
      description: t("connect_with_doctor"),
    },
  ];

  return (
    <AuroraBackground>
      <div className="w-full">
        <div className="p-4 flex justify-between items-center bg-white/80 dark:bg-[#1A1F2C]/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/15e20ff0-66a5-4888-b578-9c94d3d5f851.png" 
              alt="UroCenter"
              className="h-12 w-auto"
            />
          </div>
          <LanguageSelector />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 max-w-7xl mx-auto w-full space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="relative inline-block">
              <img
                src="/lovable-uploads/06b7c9e0-66fd-4a8e-8025-584b2a539eae.png"
                alt={t("doctor_name")}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="space-y-1 mt-3">
              <h1 className="text-2xl font-bold tracking-tight text-primary">
                {t("doctor_name")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("doctor_title")}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-2 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mb-2 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xs font-semibold">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <TestimonialsCarousel />

          <div className="w-full space-y-2 max-w-md mx-auto">
            <RainbowButton
              className="w-full"
              onClick={() => navigate("/signup")}
            >
              {t("start_journey")}
            </RainbowButton>
            <p className="text-xs text-muted-foreground text-center">
              {t("already_have_account")}{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-primary hover:underline font-medium transition-colors"
              >
                {t("sign_in")}
              </button>
            </p>
          </div>
        </div>
        
        <footer className="p-3 text-center text-xs text-muted-foreground dark:text-gray-400" />
      </div>
    </AuroraBackground>
  );
};

export default Welcome;