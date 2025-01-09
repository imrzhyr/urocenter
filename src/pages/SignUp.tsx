import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col justify-center items-center p-6"
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <motion.svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </motion.svg>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {t('create_account')}
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            {t('sign_up_description')}
          </p>
        </CardHeader>
        <CardContent>
          <PhoneInput value={phone} onChange={setPhone} isSignUp={true} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SignUp;