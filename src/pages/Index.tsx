import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageSquare, Stethoscope } from "lucide-react";

export default function Index() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-[#1C1C1E]">
        <img 
          src="/logo.png" 
          alt="URO Center" 
          className="h-8"
        />
        <Button
          variant="ghost"
          onClick={() => navigate('/language')}
          className={cn(
            "text-[17px]",
            "text-[#007AFF] dark:text-[#0A84FF]",
            "hover:bg-[#007AFF]/10 dark:hover:bg-[#0A84FF]/10",
            "active:bg-[#007AFF]/20 dark:active:bg-[#0A84FF]/20"
          )}
        >
          {t('English')}
        </Button>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Doctor Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "bg-white dark:bg-[#1C1C1E]",
            "rounded-2xl",
            "shadow-sm",
            "border border-[#C6C6C8] dark:border-[#38383A]",
            "overflow-hidden"
          )}
        >
          <div className="aspect-square w-32 mx-auto mt-6 rounded-full overflow-hidden border-4 border-[#007AFF] dark:border-[#0A84FF]">
            <img
              src="/doctor.jpg"
              alt="Dr. Ali Kamal"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 text-center">
            <h1 className="text-[24px] font-semibold text-[#1C1C1E] dark:text-white mb-1">
              {t('Dr. Ali Kamal')}
            </h1>
            <p className="text-[17px] text-[#8E8E93] dark:text-[#98989D]">
              {t('Consultant Urologist')}
            </p>
          </div>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              "bg-white dark:bg-[#1C1C1E]",
              "rounded-2xl",
              "shadow-sm",
              "border border-[#C6C6C8] dark:border-[#38383A]",
              "p-4",
              "flex flex-col items-center text-center",
              "w-full"
            )}
          >
            <motion.div 
              className="w-12 h-12 rounded-full bg-[#007AFF]/10 dark:bg-[#0A84FF]/10 flex items-center justify-center mb-3"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.9, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Stethoscope className="w-6 h-6 text-[#007AFF] dark:text-[#0A84FF]" />
            </motion.div>
            <h3 className="text-[17px] font-semibold text-[#1C1C1E] dark:text-white mb-1">
              {t('Expert Medical Care')}
            </h3>
            <p className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
              {t('Specialized treatment for urological conditions')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn(
              "bg-white dark:bg-[#1C1C1E]",
              "rounded-2xl",
              "shadow-sm",
              "border border-[#C6C6C8] dark:border-[#38383A]",
              "p-4",
              "flex flex-col items-center text-center",
              "w-full"
            )}
          >
            <motion.div 
              className="w-12 h-12 rounded-full bg-[#007AFF]/10 dark:bg-[#0A84FF]/10 flex items-center justify-center mb-3"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.9, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1 // Offset animation to create alternating effect
              }}
            >
              <MessageSquare className="w-6 h-6 text-[#007AFF] dark:text-[#0A84FF]" />
            </motion.div>
            <h3 className="text-[17px] font-semibold text-[#1C1C1E] dark:text-white mb-1">
              {t('Direct Communication')}
            </h3>
            <p className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
              {t('Connect directly with your doctor')}
            </p>
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className={cn(
            "bg-white dark:bg-[#1C1C1E]",
            "rounded-2xl",
            "shadow-sm",
            "border border-[#C6C6C8] dark:border-[#38383A]",
            "p-6",
            "w-full"
          )}
        >
          <h3 className="text-[17px] font-semibold text-[#1C1C1E] dark:text-white mb-4">
            {t('What Our Patients Say')}
          </h3>
          
          <div className="space-y-6">
            {/* First Testimonial */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="min-h-[44px] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 dark:bg-[#0A84FF]/10 flex items-center justify-center">
                    <span className="text-[17px] font-semibold text-[#007AFF] dark:text-[#0A84FF]">AK</span>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#1C1C1E] dark:text-white">
                      {t('testimonial_author')}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#FFB340]">
                        {"★★★★★".split("").map((star, i) => (
                          <span key={i} className={i >= 4.5 ? "opacity-30" : ""}>
                            {star}
                          </span>
                        ))}
                      </div>
                      <span className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
                        4.5
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
                  2 days ago
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#1C1C1E] dark:text-white">
                {t('testimonial_text')}
              </p>
            </div>

            {/* Second Testimonial */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="min-h-[44px] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 dark:bg-[#0A84FF]/10 flex items-center justify-center">
                    <span className="text-[17px] font-semibold text-[#007AFF] dark:text-[#0A84FF]">MH</span>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-[#1C1C1E] dark:text-white">
                      {t('testimonial_author_2')}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#FFB340]">
                        {"★★★★★".split("").map((star, i) => (
                          <span key={i} className={i >= 5 ? "opacity-30" : ""}>
                            {star}
                          </span>
                        ))}
                      </div>
                      <span className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
                        5.0
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
                  1 week ago
                </span>
              </div>
              <p className="text-[15px] leading-relaxed text-[#1C1C1E] dark:text-white">
                {t('testimonial_text_2')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="pt-4"
        >
          <Button
            onClick={() => navigate('/sign-up')}
            className={cn(
              "w-full",
              "h-14",
              "rounded-2xl",
              "text-[17px]",
              "font-semibold",
              "bg-[#007AFF] dark:bg-[#0A84FF]",
              "hover:bg-[#007AFF]/90 dark:hover:bg-[#0A84FF]/90",
              "active:bg-[#007AFF]/80 dark:active:bg-[#0A84FF]/80",
              "text-white",
              "shadow-sm"
            )}
          >
            {t('Begin Your Medical Journey')}
          </Button>
          <p className="text-center mt-4 text-[13px] text-[#8E8E93] dark:text-[#98989D]">
            {t('Already have an account?')}{' '}
            <button
              onClick={() => navigate('/sign-in')}
              className="text-[#007AFF] dark:text-[#0A84FF]"
            >
              {t('Sign In')}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
}