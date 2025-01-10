import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";
import { MainLayout } from "./features/shared/components/layouts/MainLayout";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
        <Toaster />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;