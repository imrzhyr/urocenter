import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SignIn = () => {
  const [phone, setPhone] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-background"
    >
      <div className="p-4 flex justify-between items-center relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <LanguageSelector />
      </div>
      
      <div className="flex-1 container max-w-md mx-auto flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform -translate-y-12">
              <motion.svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </motion.svg>
            </div>
            <CardTitle className="text-2xl font-semibold text-primary mt-4">
              {t('welcome_back')}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {t('sign_in_continue')}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg p-4">
              <PhoneInput value={phone} onChange={setPhone} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground">
        {t('all_rights_reserved')}
      </footer>
    </motion.div>
  );
};

export default SignIn;