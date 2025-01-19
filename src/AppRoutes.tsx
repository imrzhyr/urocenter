import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Chat from "@/pages/Chat";
import MedicalInformation from "@/pages/MedicalInformation";
import Payment from "@/pages/Payment";
import PaymentVerification from "@/pages/PaymentVerification";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminStatistics from "@/pages/AdminStatistics";
import AdminPayments from "@/pages/AdminPayments";
import UserChat from "@/pages/UserChat";
import { CallProvider } from "@/components/chat/call/CallProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/chat",
    element: <UserChat />,
  },
  {
    path: "/medical-information",
    element: <MedicalInformation />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/payment-verification",
    element: <PaymentVerification />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/statistics",
    element: <AdminStatistics />,
  },
  {
    path: "/admin/payments",
    element: <AdminPayments />,
  },
]);

function AppRoutes() {
  return (
    <CallProvider>
      <RouterProvider router={router} />
    </CallProvider>
  );
}

export default AppRoutes;