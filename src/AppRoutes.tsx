import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { OnboardingLayout } from "./components/layouts/OnboardingLayout";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Onboarding Flow */}
          <Route element={<OnboardingLayout />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/medical-information" element={<MedicalInformation />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          {/* Main App Routes */}
          <Route
            path="/dashboard"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Dashboard />
              </motion.div>
            }
          />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route
            path="/chat"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Chat />
              </motion.div>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <UserChat />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};