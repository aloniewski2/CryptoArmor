import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Index from "./pages/Index";
import Scanner from "./pages/Scanner";
import WalletReputation from "./pages/WalletReputation";
import Documentation from "./pages/Documentation";
import TestingMode from "./pages/TestingMode";
import TestnetDashboard from "./pages/TestnetDashboard";
import TestnetSetup from "./pages/TestnetSetup";
import TestnetCompliance from "./pages/TestnetCompliance";
import TestnetConnection from "./pages/TestnetConnection";
import AttackSimulationTestnet from "./pages/AttackSimulationTestnet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppSidebar>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/wallet" element={<WalletReputation />} />
            <Route path="/testing" element={<TestingMode />} />
            <Route path="/testnet" element={<TestnetDashboard />} />
            <Route path="/testnet/setup" element={<TestnetSetup />} />
            <Route path="/testnet/connection" element={<TestnetConnection />} />
            <Route path="/testnet/simulation" element={<AttackSimulationTestnet />} />
            <Route path="/testnet/compliance" element={<TestnetCompliance />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppSidebar>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
