import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Welcome from "@/pages/Welcome";
import MedicalInformation from "@/pages/MedicalInformation";
import Payment from "@/pages/Payment";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/medical-information" element={<MedicalInformation />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <Toaster />
      <Sonner />
    </Router>
  );
};

export default App;