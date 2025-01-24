import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { motion } from "framer-motion";
import { Typewriter } from "@/components/ui/typewriter-text";
import { Globe, Check } from "lucide-react";

export default function StartupScreen() {
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();
    const [showContinue, setShowContinue] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);

    const englishTexts = [
        "Board Certified Urologist",
        "Medical Care at Your Fingertips",
        "Chat with Your Doctor Instantly",
        "Private Audio Consultations",
        "Healthcare from Home"
    ];

    const arabicTexts = [
        "استشاري معتمد في المسالك البولية",
        "رعاية طبية في متناول يدك",
        "تواصل فوري مع طبيبك",
        "استشارات صوتية خاصة",
        "رعاية صحية من المنزل"
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContinue(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const selectLanguage = (lang: 'en' | 'ar') => {
        setLanguage(lang);
        setShowLanguageMenu(false);
    };

    return (
        <div className="relative min-h-screen">
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

            <HeroGeometric
                badge={language === 'ar' ? 'يوروسنتر' : 'UROCENTER'}
                title1={language === 'ar' ? 'د. علي كمال' : 'Dr. Ali Kamal'}
                title2={language === 'ar' ? 'استشاري المسالك البولية' : 'Consultant Urologist'}
            />
            
            <div className="absolute top-1/2 left-0 right-0 mt-16 text-center z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    <Typewriter
                        text={language === 'ar' ? arabicTexts : englishTexts}
                        speed={80}
                        deleteSpeed={40}
                        delay={2000}
                        loop={true}
                        className={`text-lg md:text-xl font-medium text-white/90 ${language === 'ar' ? 'font-arabic' : ''}`}
                    />
                </motion.div>
            </div>
            
            {showContinue && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute bottom-[25%] left-0 right-0 flex flex-col items-center gap-4 z-20"
                >
                    <button
                        onClick={() => navigate('/welcome')}
                        className={`
                            px-8 py-3.5 rounded-2xl text-white font-medium text-[17px]
                            bg-[#0A84FF] hover:bg-[#0070E2] active:bg-[#0063C9]
                            transform transition-all duration-200
                            shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_1px_1px_0_rgba(0,0,0,0.05)]
                            active:scale-[0.97]
                            backdrop-blur-sm
                            ${language === 'ar' ? 'font-arabic' : ''}
                        `}
                    >
                        {language === 'ar' ? 'متابعة' : 'Continue'}
                    </button>
                </motion.div>
            )}
        </div>
    );
} 