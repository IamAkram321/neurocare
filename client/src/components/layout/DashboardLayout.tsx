import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Calendar, 
  Settings, 
  FileText, 
  Bell 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return <>{children}</>;

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard", roles: ["admin", "doctor", "nurse", "patient"] },
    { icon: Users, label: "Patients", href: "/dashboard/patients", roles: ["admin", "doctor", "nurse"] },
    { icon: Activity, label: "Real-time Monitor", href: "/dashboard/monitor", roles: ["admin", "doctor", "nurse"] },
    { icon: FileText, label: "Reports", href: "/dashboard/reports", roles: ["admin", "doctor", "patient"] },
    { icon: Calendar, label: "Schedule", href: "/dashboard/schedule", roles: ["admin", "doctor", "nurse"] },
    { icon: Bell, label: "Alerts", href: "/dashboard/alerts", roles: ["admin", "doctor", "nurse"] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Hidden on mobile, handled by Navbar sheet */}
        <aside className="hidden w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm lg:flex">
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                if (!item.roles.includes(user.role)) return null;
                const isActive = location === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start mb-1",
                        isActive && "bg-secondary text-secondary-foreground font-medium shadow-sm"
                      )}
                    >
                      <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
            
            {user.role === "admin" && (
              <>
                <div className="mt-8 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin Controls
                </div>
                <div className="space-y-1">
                   <Button variant="ghost" className="w-full justify-start">
                     <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
                     System Settings
                   </Button>
                </div>
              </>
            )}
          </div>
          <div className="p-4 border-t border-border bg-card">
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <div className="flex items-center gap-3">
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                   <Activity className="h-4 w-4" />
                 </div>
                 <div>
                   <p className="text-xs font-medium text-foreground">System Status</p>
                   <p className="text-xs text-green-600 font-bold flex items-center">
                     <span className="block h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse" />
                     Online
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
