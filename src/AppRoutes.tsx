import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import MedicalInformation from "@/pages/MedicalInformation";
import Payment from "@/pages/Payment";
import Dashboard from "@/pages/Dashboard";
import { OnboardingLayout } from "@/components/layouts/OnboardingLayout";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signin" element={<SignIn />} />
      
      {/* Onboarding Flow */}
      <Route element={<OnboardingLayout />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medical-information" element={<MedicalInformation />} />
        <Route path="/payment" element={<Payment />} />
      </Route>

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};