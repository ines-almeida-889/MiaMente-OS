import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/login";
import ParentForm from "@/pages/parent-form";
import ClinicianForm from "@/pages/clinician-form";
import Signup from "@/pages/signup";
import ParentDashboard from "@/pages/parent-dashboard";
import ClinicDashboard from "@/pages/clinic-dashboard";
import IntakeForm from "@/pages/intake-form";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/parent-form" component={ParentForm} />
      <Route path="/clinician-form" component={ClinicianForm} />
      <Route path="/signup" component={Signup} />
      <Route path="/parent-dashboard" component={ParentDashboard} />
      <Route path="/clinic-dashboard" component={ClinicDashboard} />
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
