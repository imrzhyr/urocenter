import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/PhoneInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [phone, setPhone] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignUpSuccess = () => {
    navigate("/profile", { replace: true });
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800">
        <CardHeader className="space-y-1.5">
          <div className="mx-auto w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <motion.svg
              className="w-5 h-5 text-white"
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
          <CardTitle className="text-center text-lg font-medium text-primary">
            {t('create_account')}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            {t('sign_up_description')}
          </p>
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
  );
};

export default SignUp;