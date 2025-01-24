import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import type { Profile } from "@/types/profile";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile: initialProfile, isLoading, refetch } = useOnboarding();
  const { updateProfile } = useProfile();
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: localStorage.getItem('profileId') || '',
    full_name: '',
    gender: '',
    age: '',
    complaint: '',
    phone: localStorage.getItem('userPhone') || '',
    role: 'patient'
  });

  useEffect(() => {
    if (initialProfile && !isLoading) {
      setProfile({
        ...initialProfile,
        phone: localStorage.getItem('userPhone') || initialProfile.phone || ''
      });
    }
  }, [initialProfile, isLoading]);

  const handleProfileChange = useCallback((field: keyof Profile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
      phone: localStorage.getItem('userPhone') || prev.phone || ''
    }));
  }, []);

  const isFormValid = useCallback(() => {
    const hasValidName = profile.full_name?.trim().split(' ').length >= 2;
    return hasValidName && 
      profile.gender && 
      profile.age && 
      profile.complaint;
  }, [profile.full_name, profile.gender, profile.age, profile.complaint]);

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error(t('please_fill_all_fields'), {
        className: cn(
          "bg-[#1C1C1E]/80 backdrop-blur-xl",
          "border border-white/[0.08]",
          "text-white",
          "rounded-2xl"
        )
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateProfile(profile);
      if (success) {
        await refetch();
        navigate("/medical-information");
        toast.success(t('profile_updated'), {
          className: cn(
            "bg-[#1C1C1E]/80 backdrop-blur-xl",
            "border border-white/[0.08]",
            "text-white",
            "rounded-2xl"
          )
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(t('profile_update_error'), {
        className: cn(
          "bg-[#1C1C1E]/80 backdrop-blur-xl",
          "border border-white/[0.08]",
          "text-white",
          "rounded-2xl"
        )
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen message={t('loading')} />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={language}
        className="flex-1 flex flex-col p-4 max-w-md w-full mx-auto space-y-4"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <motion.h1 
          className="text-4xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
        >
          <span className="text-[#0A84FF]">
            {t('complete_profile')}
          </span>
        </motion.h1>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div 
            className="space-y-3"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <label className="text-[15px] font-medium text-white/60 px-1">
              {t('full_name')}
            </label>
            <input
              type="text"
              value={profile.full_name || ""}
              onChange={(e) => {
                const names = e.target.value.split(' ').map(name => 
                  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
                ).join(' ');
                handleProfileChange('full_name', names);
              }}
              placeholder={t('enter_full_name')}
              className={cn(
                "w-full h-12 px-4 text-base rounded-xl",
                "bg-[#1C1C1E]/60 backdrop-blur-xl border border-white/[0.08] text-white",
                "hover:bg-[#1C1C1E]/70",
                "focus:outline-none focus:ring-0 focus:border-white/[0.08]",
                "transition-all duration-200",
                "placeholder:text-white/40",
                "shadow-lg shadow-black/5",
                !profile.full_name?.trim().split(' ').length && profile.full_name && "border-red-500/50"
              )}
            />
          </motion.div>

          <motion.div 
            className="space-y-3"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <label className="text-[15px] font-medium text-white/60 px-1">
              {t('gender')}
            </label>
            <div className="flex gap-4">
              {['male', 'female'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleProfileChange('gender', gender)}
                  className={cn(
                    "flex-1 h-12 rounded-xl text-base font-medium transition-all duration-200",
                    "backdrop-blur-xl",
                    profile.gender === gender
                      ? "bg-[#0A84FF] text-white shadow-lg shadow-[#0A84FF]/20"
                      : "bg-[#1C1C1E]/60 border border-white/[0.08] text-white/60 hover:bg-[#1C1C1E]/70"
                  )}
                >
                  {t(gender)}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="space-y-3"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <label className="text-[15px] font-medium text-white/60 px-1">
              {t('age')}
            </label>
            <input
              type="number"
              value={profile.age || ""}
              onChange={(e) => handleProfileChange('age', e.target.value)}
              placeholder={t('enter_age')}
              min="0"
              max="150"
              className={cn(
                "w-full h-12 px-4 text-base rounded-xl",
                "bg-[#1C1C1E]/60 backdrop-blur-xl border border-white/[0.08] text-white",
                "hover:bg-[#1C1C1E]/70",
                "focus:outline-none focus:ring-0 focus:border-white/[0.08]",
                "transition-all duration-200",
                "placeholder:text-white/40",
                "shadow-lg shadow-black/5"
              )}
            />
          </motion.div>

          <motion.div 
            className="space-y-3"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <label className="text-[15px] font-medium text-white/60 px-1">
              {t('medical_complaint')}
            </label>
            <textarea
              value={profile.complaint || ""}
              onChange={(e) => handleProfileChange('complaint', e.target.value)}
              placeholder={t('enter_complaint')}
              rows={4}
              className={cn(
                "w-full p-4 text-base rounded-xl",
                "bg-[#1C1C1E]/60 backdrop-blur-xl border border-white/[0.08] text-white",
                "hover:bg-[#1C1C1E]/70",
                "focus:outline-none focus:ring-0 focus:border-white/[0.08]",
                "transition-all duration-200",
                "placeholder:text-white/40",
                "shadow-lg shadow-black/5",
                "resize-none"
              )}
            />
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pt-4"
          >
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className={cn(
                "w-full",
                "h-[44px]",
                "text-[17px] font-medium",
                "rounded-xl",
                "shadow-lg",
                "transition-all duration-200",
                "disabled:opacity-50",
                "active:scale-[0.97]",
                isFormValid() && !isSubmitting
                  ? "bg-[#0A84FF] hover:opacity-90 text-white"
                  : "bg-[#1C1C1E]/60 backdrop-blur-xl border border-white/[0.08] text-white/40"
              )}
            >
              <span className={cn(
                "flex items-center justify-center gap-2",
                isSubmitting && "opacity-0"
              )}>
                {t('continue')}
              </span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProfilePage;