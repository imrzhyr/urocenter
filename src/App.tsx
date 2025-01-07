import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import UserChat from "./pages/UserChat";
import MedicalInformation from "./pages/MedicalInformation";
import Payment from "./pages/Payment";
import Welcome from "./pages/Welcome";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<UserChat />} />
        <Route path="/chat/:patientId" element={<Chat />} />
        <Route path="/medical-information" element={<MedicalInformation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;