import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppRoutes } from './AppRoutes';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <AppRoutes />
        <Toaster />
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App;