import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Clock, Filter, Activity, Users, Bed } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";

export default function ShiftLog() {
  const shiftLogs = [
    { id: 1, time: "08:00 AM", event: "Shift Change", user: "Dr. Ananya Sharma", details: "Morning shift handover completed. 12 patients in ICU A, 8 in ICU B." },
    { id: 2, time: "09:15 AM", event: "Critical Alert", user: "System", details: "Patient PAT-001 showed elevated heart rate (>110bpm)." },
    { id: 3, time: "09:20 AM", event: "Medication Administered", user: "Nurse Kavita Singh", details: "Administered prescribed Amiodarone to PAT-001." },
    { id: 4, time: "10:30 AM", event: "New Admission", user: "Dr. Rajesh Kumar", details: "Patient PAT-004 admitted to ICU B with severe sepsis." },
    { id: 5, time: "11:45 AM", event: "Vitals Update", user: "System", details: "PAT-004 SpO2 stabilized at 92%." },
    { id: 6, time: "12:00 PM", event: "Clinical Note", user: "Dr. Priya Patel", details: "Reviewed PAT-003 progress. Respiratory function improving." },
    { id: 7, time: "02:30 PM", event: "Medication Administered", user: "Nurse Kavita Singh", details: "Administered scheduled fluids for PAT-002." },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/dashboard"><Button variant="ghost" size="sm" className="pl-0"><ArrowLeft className="mr-1 h-4 w-4"/> Dashboard</Button></Link>
          <span>/</span>
          <span className="font-medium text-foreground">Shift Log</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              Central Shift Log
            </h1>
            <p className="text-muted-foreground">Comprehensive timeline of events and clinical actions for the current shift.</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filter Events</Button>
          </div>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Events for Today, {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              {shiftLogs.map((log, index) => (
                <div key={log.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                  
                  {/* Marker */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted-foreground/20 group-hover:bg-primary group-hover:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                    {log.event === 'Critical Alert' ? <Activity className="h-4 w-4 text-destructive group-hover:text-white" /> : 
                     log.event === 'New Admission' ? <Bed className="h-4 w-4 group-hover:text-white" /> :
                     log.event === 'Shift Change' ? <Users className="h-4 w-4 group-hover:text-white" /> :
                     <div className="h-2 w-2 rounded-full bg-current" />}
                  </div>
                  
                  {/* Card */}
                  <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-shadow border-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{log.event}</span>
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{log.time}</span>
                      </div>
                      <p className="text-sm text-foreground/80">{log.details}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {log.user === 'System' ? 'S' : log.user[0]}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{log.user}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}