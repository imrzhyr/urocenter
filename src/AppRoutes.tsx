import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Welcome from "@/pages/Welcome";
import MedicalInformation from "@/pages/MedicalInformation";
import Payment from "@/pages/Payment";
import Settings from "@/pages/Settings";
import AdminDashboard from "@/pages/AdminDashboard";
import UserChat from "@/pages/UserChat";
import { OnboardingLayout } from "@/components/layouts/OnboardingLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    element: <OnboardingLayout />,
    children: [
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/medical-information",
        element: <MedicalInformation />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/chat",
    element: <UserChat />,
  },
  {
    path: "/chat/:userId",
    element: <Chat />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};