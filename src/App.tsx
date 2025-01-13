import AppRoutes from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BrowserRouter } from "react-router-dom";

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