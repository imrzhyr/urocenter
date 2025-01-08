import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Welcome from "./pages/Welcome";
import Chat from "./pages/Chat";
import UserChat from "./pages/UserChat";
import MedicalInformation from "./pages/MedicalInformation";
import Payment from "./pages/Payment";

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="page-transition">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:userId" element={<UserChat />} />
          <Route path="/medical-information" element={<MedicalInformation />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Suspense>
  );
};