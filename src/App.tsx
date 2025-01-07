declare global {
  interface Window {
    ethereum?: any;
  }
}

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "next-themes";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Payment from "@/pages/Payment";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Chat from "@/pages/Chat";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import MedicalInformation from "@/pages/MedicalInformation";

// More defensive check for Web3 provider conflicts
try {
  if (typeof window !== 'undefined' && !window.ethereum) {
    Object.defineProperty(window, 'ethereum', {
      value: {},
      writable: true,
      configurable: true
    });
  }
} catch (error) {
  console.warn('Web3 provider already initialized');
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const variants = {
    initial: {
      opacity: 0,
      x: -20,
      position: "absolute" as const,
      width: "100%",
      height: "100%",
    },
    animate: {
      opacity: 1,
      x: 0,
      position: "absolute" as const,
      width: "100%",
      height: "100%",
    },
    exit: {
      opacity: 0,
      x: 20,
      position: "absolute" as const,
      width: "100%",
      height: "100%",
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.15,
        ease: [0.645, 0.045, 0.355, 1.000]
      }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
        <Route path="/signin" element={<PageWrapper><SignIn /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignUp /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/medical-information" element={<PageWrapper><MedicalInformation /></PageWrapper>} />
        <Route path="/payment" element={<PageWrapper><Payment /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/chat" element={<PageWrapper><Chat /></PageWrapper>} />
        <Route path="/edit-profile" element={<PageWrapper><EditProfileForm /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <AnimatedRoutes />
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
