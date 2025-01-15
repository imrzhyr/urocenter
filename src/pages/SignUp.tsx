import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BackButton } from "@/components/BackButton";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSignUpSuccess = () => {
    navigate("/profile", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-background dark:from-primary/10 dark:via-gray-900 dark:to-background">
      <div className={`p-4 flex justify-between items-center relative z-10 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <BackButton />
        <LanguageSelector />
      </div>
      
      <div className="container max-w-md mx-auto my-auto px-4">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <motion.svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
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
          <h1 className="text-2xl font-semibold text-primary">
            {t('create_account')}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {t('sign_up_description')}
          </p>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              {t('enter_phone')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <PhoneInput 
                value={phone} 
                onChange={setPhone} 
                isSignUp={true} 
                onSignUpSuccess={handleSignUpSuccess}
              />
            </motion.div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground mt-auto">
        {t('all_rights_reserved')}
      </footer>
    </div>
  );
};

export default SignUp;