import { lazy, Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";

const Index = lazy(() => import("@/pages/Index"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Chat = lazy(() => import("@/pages/Chat"));
const Profile = lazy(() => import("@/pages/Profile"));
const MedicalInformation = lazy(() => import("@/pages/MedicalInformation"));
const Payment = lazy(() => import("@/pages/Payment"));
const Settings = lazy(() => import("@/pages/Settings"));

const routes = [
  {
    path: "/",
    element: <Index />,
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
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/chat/:userId",
    element: <Chat />,
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
  {
    path: "/settings",
    element: <Settings />,
  },
];

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export { routes };