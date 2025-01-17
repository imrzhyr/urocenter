import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { OnboardingLayout } from "@/components/layouts/OnboardingLayout";

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
    path: "/",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Welcome />
      </Suspense>
    ),
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    element: <OnboardingLayout />,
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
    path: "/payment-verification",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <PaymentVerification />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "/chat",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <UserChat />
      </Suspense>
    ),
  },
  {
    path: "/chat/:userId",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Chat />
      </Suspense>
    ),
  },
  {
    path: "/settings",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Settings />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <AdminDashboard />
      </Suspense>
    ),
  },
  {
    path: "/admin/statistics",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <AdminStatistics />
      </Suspense>
    ),
  },
  {
    path: "/admin/payments",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <AdminPayments />
      </Suspense>
    ),
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};