import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/auth";
import Overview from "@/pages/dashboards/Overview";
import PatientDetail from "@/pages/dashboards/PatientDetail";
import ShiftLog from "@/pages/dashboards/ShiftLog";
import DoctorProfile from "@/pages/dashboards/DoctorProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" component={Overview} />
      <Route path="/dashboard/patients" component={Overview} />
      <Route path="/dashboard/patient/:id" component={PatientDetail} />
      <Route path="/dashboard/shift-log" component={ShiftLog} />
      <Route path="/dashboard/doctor/:id" component={DoctorProfile} />
      
      {/* Fallback to Overview for other dashboard sub-routes for now */}
      <Route path="/dashboard/*" component={Overview} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
