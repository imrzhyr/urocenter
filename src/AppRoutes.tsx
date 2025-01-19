import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingLayout } from "@/components/layouts/OnboardingLayout";
import { CallProvider } from "@/components/chat/call/CallProvider";

// Lazy load components
const Welcome = lazy(() => import("@/pages/Welcome"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Profile = lazy(() => import("@/pages/Profile"));
const MedicalInformation = lazy(() => import("@/pages/MedicalInformation"));
const Payment = lazy(() => import("@/pages/Payment"));
const PaymentVerification = lazy(() => import("@/pages/PaymentVerification"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const UserChat = lazy(() => import("@/pages/UserChat"));
const Chat = lazy(() => import("@/pages/Chat"));
const Settings = lazy(() => import("@/pages/Settings"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminStatistics = lazy(() => import("@/pages/AdminStatistics"));
const AdminPayments = lazy(() => import("@/pages/AdminPayments"));

const router = createBrowserRouter([
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Welcome />
        </Suspense>
      </CallProvider>
    ),
    path: "/",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <SignIn />
        </Suspense>
      </CallProvider>
    ),
    path: "/signin",
  },
  {
    element: (
      <CallProvider>
        <OnboardingLayout />
      </CallProvider>
    ),
    children: [
      {
        path: "/signup",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "/medical-information",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <MedicalInformation />
          </Suspense>
        ),
      },
      {
        path: "/payment",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Payment />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <PaymentVerification />
        </Suspense>
      </CallProvider>
    ),
    path: "/payment-verification",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Dashboard />
        </Suspense>
      </CallProvider>
    ),
    path: "/dashboard",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <UserChat />
        </Suspense>
      </CallProvider>
    ),
    path: "/chat",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Chat />
        </Suspense>
      </CallProvider>
    ),
    path: "/chat/:userId",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Settings />
        </Suspense>
      </CallProvider>
    ),
    path: "/settings",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <AdminDashboard />
        </Suspense>
      </CallProvider>
    ),
    path: "/admin",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <AdminStatistics />
        </Suspense>
      </CallProvider>
    ),
    path: "/admin/statistics",
  },
  {
    element: (
      <CallProvider>
        <Suspense fallback={<LoadingScreen />}>
          <AdminPayments />
        </Suspense>
      </CallProvider>
    ),
    path: "/admin/payments",
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};