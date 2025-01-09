import { Routes, Route } from "react-router-dom";
import { OnboardingLayout } from "@/components/layouts/OnboardingLayout";

// Auth Pages
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";

// Main Pages
import Welcome from "@/pages/Welcome";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Settings from "@/pages/Settings";

// Profile Pages
import { ProfilePage } from "@/pages/Profile";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import MedicalInformation from "@/pages/MedicalInformation";
import Payment from "@/pages/Payment";

// Chat & Call Pages
import Chat from "@/pages/Chat";
import UserChat from "@/pages/UserChat";
import { CallPage } from "@/components/call/CallPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<SignIn />} />
      
      {/* Onboarding Flow */}
      <Route element={<OnboardingLayout />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/medical-information" element={<MedicalInformation />} />
        <Route path="/payment" element={<Payment />} />
      </Route>

      {/* Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Chat & Call Routes */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/user-chat" element={<UserChat />} />
      <Route path="/call/:userId" element={<CallPage />} />
    </Routes>
  );
};