import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppRoutes />
        <Toaster />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;