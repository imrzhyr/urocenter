import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Payment from "@/pages/Payment";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import MedicalInformation from "@/pages/MedicalInformation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medical-information" element={<MedicalInformation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;