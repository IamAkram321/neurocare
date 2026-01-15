import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";
import { Link } from "wouter";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [hospitalCode, setHospitalCode] = useState("HOSP-001"); // Pre-fill for demo
  const [userId, setUserId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(hospitalCode, userId);
  };

  const handleDemoFill = (role: string) => {
    const demoUser = MOCK_USERS.find(u => u.role === role);
    if (demoUser) {
      setUserId(demoUser.id);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/50 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-800/20" />
      </div>

      <Card className="w-full max-w-md z-10 shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <Activity className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your hospital credentials to access the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Hospital Code</Label>
              <Input 
                id="code" 
                placeholder="HOSP-XXXX" 
                value={hospitalCode}
                onChange={(e) => setHospitalCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userid">User ID / Medical ID</Label>
              <Input 
                id="userid" 
                placeholder="DOC-001" 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Quick Login Helper for Prototype */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground mb-3">
              Prototype Quick Access (Click to fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleDemoFill("admin")} className="text-xs">Admin</Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoFill("doctor")} className="text-xs">Doctor</Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoFill("nurse")} className="text-xs">Nurse</Button>
              <Button variant="outline" size="sm" onClick={() => handleDemoFill("patient")} className="text-xs">Patient</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
           <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
             Back to Home
           </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
