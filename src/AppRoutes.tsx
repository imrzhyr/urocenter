import { Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingLayout } from '@/components/layouts/OnboardingLayout';
import Welcome from '@/pages/Welcome';
import SignUp from '@/pages/SignUp';
import SignIn from '@/pages/SignIn';
import Profile from '@/pages/Profile';
import MedicalInformation from '@/pages/MedicalInformation';
import Payment from '@/pages/Payment';
import PaymentVerification from '@/pages/PaymentVerification';
import Dashboard from '@/pages/Dashboard';
import Chat from '@/pages/Chat';
import Settings from '@/pages/Settings';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminPayments from '@/pages/AdminPayments';
import AdminStatistics from '@/pages/AdminStatistics';
import UserChat from '@/pages/UserChat';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      
      {/* Onboarding Routes */}
      <Route element={<OnboardingLayout />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medical-information" element={<MedicalInformation />} />
        <Route path="/payment" element={<Payment />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/payment-verification" element={<PaymentVerification />} />
      
      {/* App Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:userId" element={<UserChat />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/payments" element={<AdminPayments />} />
      <Route path="/admin/statistics" element={<AdminStatistics />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;