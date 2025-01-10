import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./contexts/LanguageContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
      document.documentElement.style.textAlign = savedLanguage === 'ar' ? 'right' : 'left';
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App;