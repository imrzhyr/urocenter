import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useTransition, Suspense } from "react";

const App = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Suspense>
      <BrowserRouter>
        <LanguageProvider>
          <AppRoutes />
          <Toaster />
        </LanguageProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;