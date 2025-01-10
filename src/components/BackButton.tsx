import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const BackButton = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const Icon = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <button 
      onClick={() => navigate(-1)} 
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};