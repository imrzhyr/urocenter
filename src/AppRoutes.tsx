import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Lazy load components with prefetching
const Dashboard = lazy(() => {
  const component = import("@/pages/Dashboard");
  // Prefetch other common routes
  import("@/pages/Chat");
  import("@/pages/Profile");
  return component;
});

const Chat = lazy(() => import("@/pages/Chat"));
const Profile = lazy(() => import("@/pages/Profile"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Welcome = lazy(() => import("@/pages/Welcome"));
const MedicalInformation = lazy(() => import("@/pages/MedicalInformation"));
const Payment = lazy(() => import("@/pages/Payment"));
const Settings = lazy(() => import("@/pages/Settings"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
    errorElement: <LoadingSpinner />,
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "/chat",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Chat />
      </Suspense>
    ),
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/medical-information",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <MedicalInformation />
      </Suspense>
    ),
  },
  {
    path: "/payment",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Payment />
      </Suspense>
    ),
  },
  {
    path: "/settings",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Settings />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminDashboard />
      </Suspense>
    ),
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};