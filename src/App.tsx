import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CallProvider } from "./components/chat/call/CallProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import { Toaster } from "sonner";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <LanguageProvider>
            <ThemeProvider>
              <AuthProvider>
                <CallProvider>
                  <AppRoutes />
                  <Toaster 
                    position="top-center"
                    expand={false}
                    richColors
                    closeButton
                    duration={2000}
                    className="!top-4"
                  />
                </CallProvider>
              </AuthProvider>
            </ThemeProvider>
          </LanguageProvider>
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;