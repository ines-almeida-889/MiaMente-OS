import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleSwitcher } from "@/components/auth/role-switcher";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { authManager } from "@/lib/auth";
import ParentDashboard from "@/pages/parent-dashboard";
import ClinicDashboard from "@/pages/clinic-dashboard";
import InsuranceDashboard from "@/pages/insurance-dashboard";
import IntakeForm from "@/pages/intake-form";
import NotFound from "@/pages/not-found";
import { Brain, Heart, Smile, Moon, Star } from "lucide-react";

function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(authManager.getState().user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = authManager.subscribe((state) => {
      setUser(state.user);
    });

    return unsubscribe;
  }, []);

  const handleRoleChange = (role: string) => {
    setIsLoading(true);
    // Simulate loading state for role switching
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background wonky-circles">
      {/* Navigation Header */}
      <nav className="relative bg-white/95 backdrop-blur-sm border-b border-mia-pink/20 px-4 lg:px-6 py-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Brain className="h-7 w-7 text-mia-navy" />
                <Smile className="h-5 w-5 text-mia-pink" />
              </div>
              <div className="mia-logo text-2xl text-mia-navy">
                mia mente
              </div>
            </div>
          </div>
          
          <RoleSwitcher onRoleChange={handleRoleChange} />
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isLoading} 
        message="Switching dashboard view..." 
        progress={50}
      />
    </div>
  );
}

function Router() {
  const [user, setUser] = useState(authManager.getState().user);

  useEffect(() => {
    const unsubscribe = authManager.subscribe((state) => {
      setUser(state.user);
    });

    return unsubscribe;
  }, []);

  // Route to appropriate dashboard based on user role
  const getDashboardComponent = () => {
    if (!user) return <ParentDashboard />;
    
    switch (user.role) {
      case 'parent':
        return <ParentDashboard />;
      case 'clinic':
        return <ClinicDashboard />;
      case 'insurance':
        return <InsuranceDashboard />;
      default:
        return <ParentDashboard />;
    }
  };

  return (
    <Switch>
      <Route path="/" component={getDashboardComponent} />
      <Route path="/intake-form" component={IntakeForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout>
          <Router />
        </Layout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
