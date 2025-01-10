import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const BackButton = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <button 
      onClick={() => navigate(-1)} 
      className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${language === 'ar' ? 'rotate-180' : ''}`}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
};