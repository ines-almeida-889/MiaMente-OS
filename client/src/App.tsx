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
import { Heart } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-bold text-slate-900">HealthConnect</span>
            </div>
          </div>
          
          <RoleSwitcher onRoleChange={handleRoleChange} />
        </div>
      </nav>

      {/* Main Content */}
      <main>
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
