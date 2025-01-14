import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppRoutes } from './AppRoutes';

function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}

export default App;