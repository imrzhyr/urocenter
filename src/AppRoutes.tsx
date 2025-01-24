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
import Terms from '@/pages/Terms';
import StartupScreen from '@/pages/StartupScreen';
import { useProfile } from '@/hooks/useProfile';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useLanguage } from '@/contexts/LanguageContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { profile, isLoading } = useProfile();
  const pathname = window.location.pathname;

  console.log('ProtectedRoute: Current pathname:', pathname);
  console.log('ProtectedRoute: Loading state:', isLoading);
  console.log('ProtectedRoute: Profile data:', profile);

  if (isLoading) {
    console.log('ProtectedRoute: Still loading profile data, showing loading screen');
    return <LoadingScreen />;
  }

  if (!profile) {
    console.log('ProtectedRoute: No profile found, redirecting to signin');
    return <Navigate to="/signin" replace />;
  }

  console.log('ProtectedRoute: User role:', profile.role);
  console.log('ProtectedRoute: Checking route access...');

  // Block non-admins from admin routes
  if (profile.role !== 'admin' && pathname.startsWith('/admin')) {
    console.log('ProtectedRoute: ❌ Non-admin trying to access admin route');
    console.log('ProtectedRoute: Redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // Block admins from user routes (except chat)
  if (profile.role === 'admin' && (pathname === '/dashboard' || pathname === '/settings')) {
    console.log('ProtectedRoute: ❌ Admin trying to access user route');
    console.log('ProtectedRoute: Current pathname:', pathname);
    console.log('ProtectedRoute: Redirecting to /admin');
    return <Navigate to="/admin" replace />;
  }

  console.log('ProtectedRoute: ✅ Access granted to:', pathname);
  console.log('ProtectedRoute: Rendering requested route');
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StartupScreen />} />
      <Route path="/welcome" element={<Welcome />} />
      
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
      <Route path="/terms" element={<Terms />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/chat/:userId" element={<ProtectedRoute><UserChat /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
      <Route path="/admin/statistics" element={<ProtectedRoute><AdminStatistics /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;