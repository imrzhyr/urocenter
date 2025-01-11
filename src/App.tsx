import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CallProvider } from "./contexts/CallContext";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <CallProvider>
          <AppRoutes />
          <Toaster />
        </CallProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;