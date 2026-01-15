import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { ArrowRight, Activity, Shield, Cpu, Lock } from "lucide-react";
import heroImage from "@assets/generated_images/high-tech_icu_monitoring_dashboard_background.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-background pt-16 pb-32">
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40">
           <img 
             src={heroImage} 
             alt="ICU Monitoring Background" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Now Live: Version 2.0
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Advanced <span className="text-primary">Multi-Patient</span> Monitoring System
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Real-time critical care analytics, role-based dashboards, and AI-driven alerts. 
            Empowering medical professionals with the data they need to save lives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/login">
              <Button size="lg" className="px-8 text-lg h-12 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                Access Portal <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8 text-lg h-12 rounded-full bg-background/50 backdrop-blur-sm">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border border-border/50">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Vitals</h3>
              <p className="text-muted-foreground">
                Continuous monitoring of ECG, SpO2, and BP with sub-second latency via secure WebSockets.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border border-border/50">
              <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4 text-teal-600 dark:text-teal-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Role-Based Access</h3>
              <p className="text-muted-foreground">
                Strict data isolation between Admins, Doctors, Nurses, and Patients ensuring HIPAA compliance.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm border border-border/50">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Alert System</h3>
              <p className="text-muted-foreground">
                Predictive algorithms to detect critical events before they happen and notify staff instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-bold">NeuroCare ICU</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 NeuroCare Systems. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0 text-sm text-muted-foreground">
             <span className="flex items-center"><Lock className="w-3 h-3 mr-1"/> Secure Connection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
