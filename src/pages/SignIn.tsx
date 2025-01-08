import { useState } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [phone, setPhone] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-white to-background">
      <div className="p-4 flex justify-between items-center relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <LanguageSelector />
      </div>
      
      <div className="container max-w-md mx-auto my-auto px-4">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-primary">
            {t('welcome_back')}
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            {t('sign_in_continue')}
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <PhoneInput value={phone} onChange={setPhone} />
        </div>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground mt-auto">
        {t('all_rights_reserved')}
      </footer>
    </div>
  );
};

export default SignIn;