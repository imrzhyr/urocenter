import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "framer-motion";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Payment from "@/pages/Payment";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import MedicalInformation from "@/pages/MedicalInformation";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const variants = {
    initial: {
      x: '100%',
    },
    animate: {
      x: 0,
    },
    exit: {
      x: '-100%',
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.2,
      }}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
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
        <Route path="/chat" element={<PageWrapper><Chat /></PageWrapper>} />
        <Route path="/edit-profile" element={<PageWrapper><EditProfileForm /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
      <Toaster />
    </Router>
  );
}

export default App;