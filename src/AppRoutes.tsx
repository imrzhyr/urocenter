import { Routes, Route } from "react-router-dom";
import { Index } from "@/pages/Index";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { Profile } from "@/pages/Profile";
import { MedicalInformation } from "@/pages/MedicalInformation";
import { Payment } from "@/pages/Payment";
import { Dashboard } from "@/pages/Dashboard";
import { Settings } from "@/pages/Settings";
import { OnboardingLayout } from "@/components/layouts/OnboardingLayout";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

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

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};