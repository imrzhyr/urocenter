import { Routes, Route } from "react-router-dom";
import Chat from "@/pages/Chat";
import UserChat from "@/pages/UserChat";
import { CallPage } from "@/components/call/CallPage";
import AdminDashboard from "@/pages/AdminDashboard";
import Dashboard from "@/pages/Dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Welcome from "@/pages/Welcome";
import MedicalInformation from "@/pages/MedicalInformation";
import Payment from "@/pages/Payment";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/medical-information" element={<MedicalInformation />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/user-chat" element={<UserChat />} />
      <Route path="/call/:userId" element={<CallPage />} />
    </Routes>
  );
};