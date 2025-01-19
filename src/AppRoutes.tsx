import { Routes, Route } from "react-router-dom";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Chat from "@/pages/Chat";
import MedicalInformation from "@/pages/MedicalInformation";
import Payment from "@/pages/Payment";
import PaymentVerification from "@/pages/PaymentVerification";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminStatistics from "@/pages/AdminStatistics";
import AdminPayments from "@/pages/AdminPayments";
import UserChat from "@/pages/UserChat";
import { DoctorChatContainer } from "@/components/chat/doctor/DoctorChatContainer";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat" element={<UserChat />} />
      <Route path="/chat/:userId" element={<DoctorChatContainer />} />
      <Route path="/medical-information" element={<MedicalInformation />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-verification" element={<PaymentVerification />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/statistics" element={<AdminStatistics />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
    </Routes>
  );
}

export default AppRoutes;