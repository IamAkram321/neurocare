import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VitalsCard } from "@/components/dashboard/VitalsCard";
import { ECGChart } from "@/components/dashboard/ECGChart";
import { MOCK_PATIENTS } from "@/lib/mockData";
import { AlertCircle, Users, Activity, Bed, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Overview() {
  const { user } = useAuth();
  
  // Filter logic based on role
  const relevantPatients = user?.role === "doctor" 
    ? MOCK_PATIENTS.filter(p => p.doctorId === user.id)
    : user?.role === "nurse"
    ? MOCK_PATIENTS.filter(p => p.wardId === user.assignedWard)
    : MOCK_PATIENTS;

  const criticalPatients = relevantPatients.filter(p => p.status === "critical");
  const stablePatients = relevantPatients.filter(p => p.status === "stable");

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {user.name}. Here's what's happening in your ward.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
               <Clock className="mr-2 h-4 w-4" /> Shift Log
            </Button>
            <Button size="sm">Generate Report</Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{relevantPatients.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last shift</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Status</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{criticalPatients.length}</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">3 beds available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Across all wards</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Patients Grid (Nurse/Doctor View) */}
        {(user.role === "nurse" || user.role === "doctor" || user.role === "admin") && (
          <div className="space-y-4">
             <h3 className="text-xl font-semibold tracking-tight">Critical Monitoring</h3>
             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
               {criticalPatients.map(patient => (
                 <Card key={patient.id} className="overflow-hidden border-destructive/50 shadow-sm hover:shadow-md transition-shadow">
                   <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-destructive/5 pb-2">
                     <div>
                       <CardTitle className="text-base font-bold flex items-center">
                         {patient.name}
                         <span className="ml-2 inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                           CRITICAL
                         </span>
                       </CardTitle>
                       <CardDescription>{patient.bedNumber} • {patient.diagnosis}</CardDescription>
                     </div>
                     <Link href={`/dashboard/patient/${patient.id}`}>
                       <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                         <ArrowRight className="h-4 w-4" />
                       </Button>
                     </Link>
                   </CardHeader>
                   <CardContent className="p-4 space-y-4">
                      {/* Vitals Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <VitalsCard 
                          title="Heart Rate" 
                          value={patient.vitals.heartRate} 
                          unit="bpm" 
                          status="critical" 
                          trend="up"
                          className="border-none shadow-none bg-background/50"
                        />
                         <VitalsCard 
                          title="SpO2" 
                          value={patient.vitals.spO2} 
                          unit="%" 
                          status="warning" 
                          trend="down"
                          className="border-none shadow-none bg-background/50"
                        />
                      </div>
                      
                      {/* Live ECG */}
                      <div className="rounded-md border border-border bg-black/5 p-2">
                         <div className="mb-1 text-xs font-mono text-muted-foreground">ECG Lead II (Live)</div>
                         <ECGChart patientId={patient.id} height={60} color="rgb(239, 68, 68)" />
                      </div>
                   </CardContent>
                 </Card>
               ))}
             </div>
          </div>
        )}
        
        {/* Patient Table (All Roles) */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Patient List</h3>
          <Card>
             <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ward/Bed</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vitals Summary</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {relevantPatients.map((patient) => (
                      <tr key={patient.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-mono text-xs">{patient.id}</td>
                        <td className="p-4 align-middle font-medium">{patient.name}</td>
                        <td className="p-4 align-middle">{patient.wardId} - {patient.bedNumber}</td>
                        <td className="p-4 align-middle">
                           <span className={cn(
                             "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset",
                             patient.status === "critical" ? "bg-red-50 text-red-700 ring-red-600/20" :
                             patient.status === "stable" ? "bg-green-50 text-green-700 ring-green-600/20" :
                             "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                           )}>
                             {patient.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex space-x-3 text-xs font-mono">
                            <span className="text-red-600">HR: {patient.vitals.heartRate}</span>
                            <span className="text-blue-600">SpO2: {patient.vitals.spO2}%</span>
                            <span className="text-orange-600">BP: {patient.vitals.bloodPressure}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Link href={`/dashboard/patient/${patient.id}`}>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper function for cn
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
