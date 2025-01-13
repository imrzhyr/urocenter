import AppRoutes from "./AppRoutes";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
      <Toaster />
    </LanguageProvider>
  );
}

export default App;