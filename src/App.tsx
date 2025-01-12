import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { startTransition, Suspense, useState } from "react";

const App = () => {
  const [isPending, startTransitionState] = useState(false);

  return (
    <Suspense>
      <BrowserRouter>
        <LanguageProvider>
          {startTransition(() => {
            startTransitionState(true);
            return <AppRoutes />;
          })}
          <Toaster />
        </LanguageProvider>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;