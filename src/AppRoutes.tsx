import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const UserChat = lazy(() => import("@/pages/UserChat"));
const Chat = lazy(() => import("@/pages/Chat"));
const Profile = lazy(() => import("@/pages/Profile"));
const MedicalInformation = lazy(() => import("@/pages/MedicalInformation"));
const Payment = lazy(() => import("@/pages/Payment"));
const Settings = lazy(() => import("@/pages/Settings"));
const Welcome = lazy(() => import("@/pages/Welcome"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

export default function AppRoutes() {
  useAuthRedirect();

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<UserChat />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/medical-information" element={<MedicalInformation />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}