import { LanguageProvider } from '@/contexts/LanguageContext';
import AppRoutes from './AppRoutes';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { Toaster } from '@/components/ui/sonner';
import { CallProvider } from '@/components/chat/call/CallProvider';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <CallProvider>
          <AppRoutes />
          <Toaster />
        </CallProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App;