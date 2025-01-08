import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/ProfileForm";
import { motion } from "framer-motion";

const Profile = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Form submission logic
      navigate("/medical-information");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Profile Information</h1>
        <p className="text-muted-foreground">
          Please provide your basic information to continue
        </p>
      </div>

      <ProfileForm onSubmit={handleSubmit} />

      <Button
        type="submit"
        form="profile-form"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Continue"}
      </Button>
    </motion.div>
  );
};

export default Profile;
