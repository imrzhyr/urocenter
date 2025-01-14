import { useEffect, useState } from "react";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SplashScreen } from "./components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      {showSplash && <SplashScreen />}
      <AppRoutes />
      <Toaster />
    </LanguageProvider>
  );
}

export default App;