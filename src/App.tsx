import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/sonner";
import { CallProvider } from "@/contexts/CallContext";

function App() {
  return (
    <BrowserRouter>
      <CallProvider>
        <AppRoutes />
        <Toaster />
      </CallProvider>
    </BrowserRouter>
  );
}

export default App;