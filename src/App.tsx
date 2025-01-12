import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { startTransition, Suspense } from "react";

const App = () => {
  return (
    <Suspense>
      <BrowserRouter>
        <LanguageProvider>
          {startTransition(() => (
            <AppRoutes />
          ))}
          <Toaster />
        </LanguageProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;