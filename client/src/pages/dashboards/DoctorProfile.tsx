import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { ArrowLeft, User, Phone, Mail, Award, Clock, Users, ShieldCheck } from "lucide-react";
import { MOCK_USERS, MOCK_PATIENTS } from "@/lib/mockData";

export default function DoctorProfile() {
  const [match, params] = useRoute("/dashboard/doctor/:id");
  
  if (!match || !params) return <div>Doctor not found</div>;
  const doctor = MOCK_USERS.find(u => u.id === (params as any).id && u.role === 'doctor');
  if (!doctor) return <div>Doctor not found</div>;

  const assignedPatients = MOCK_PATIENTS.filter(p => p.doctorId === doctor.id);
  const criticalPatients = assignedPatients.filter(p => p.status === 'critical');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/dashboard"><Button variant="ghost" size="sm" className="pl-0"><ArrowLeft className="mr-1 h-4 w-4"/> Dashboard</Button></Link>
          <span>/</span>
          <span className="font-medium text-foreground">Doctor Profile</span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 shadow-md border-primary/10">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <img src={doctor.avatar} alt={doctor.name} className="w-32 h-32 rounded-full border-4 border-background shadow-lg" />
                <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full border-2 border-background bg-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{doctor.name}</h2>
                <p className="text-primary font-medium">{doctor.specialty} Specialist</p>
                <p className="text-sm text-muted-foreground mt-1">{doctor.department}</p>
              </div>
              <div className="w-full pt-4 border-t border-border flex justify-center gap-4">
                <Button variant="outline" size="icon" className="rounded-full"><Phone className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="rounded-full"><Mail className="h-4 w-4" /></Button>
                <Button variant="default" className="rounded-full flex-1">Message</Button>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-primary/5 border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                    <p className="text-2xl font-bold">{assignedPatients.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-destructive/5 border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-destructive/10 rounded-xl text-destructive"><Activity className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical Cases</p>
                    <p className="text-2xl font-bold text-destructive">{criticalPatients.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-secondary/50 border-none shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-background rounded-xl text-foreground"><Clock className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Shift</p>
                    <p className="text-xl font-bold">08:00 - 20:00</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Professional Qualifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start border-b border-border/50 pb-2">
                    <div>
                      <p className="font-semibold">MBBS, MD ({doctor.specialty})</p>
                      <p className="text-sm text-muted-foreground">All India Institute of Medical Sciences (AIIMS)</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2010 - 2018</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-border/50 pb-2">
                    <div>
                      <p className="font-semibold">Fellowship in Critical Care</p>
                      <p className="text-sm text-muted-foreground">Christian Medical College (CMC)</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2018 - 2020</span>
                  </div>
                </div>
                <div className="pt-2">
                   <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Certifications & Licenses</h4>
                   <div className="flex flex-wrap gap-2">
                     <span className="text-xs bg-muted px-2 py-1 rounded border border-border">Medical Council of India (MCI) Registered</span>
                     <span className="text-xs bg-muted px-2 py-1 rounded border border-border">Advanced Cardiovascular Life Support (ACLS)</span>
                     <span className="text-xs bg-muted px-2 py-1 rounded border border-border">Pediatric Advanced Life Support (PALS)</span>
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Current Patient Load</CardTitle>
                <CardDescription>Patients currently under observation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignedPatients.length > 0 ? assignedPatients.map(patient => (
                    <div key={patient.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`h-2 w-2 rounded-full ${patient.status === 'critical' ? 'bg-destructive animate-pulse' : patient.status === 'recovering' ? 'bg-blue-500' : 'bg-green-500'}`} />
                         <div>
                           <p className="font-semibold text-sm">{patient.name}</p>
                           <p className="text-xs text-muted-foreground">{patient.wardId} • Bed {patient.bedNumber}</p>
                         </div>
                      </div>
                      <Link href={`/dashboard/patient/${patient.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs">View Record</Button>
                      </Link>
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No active patients assigned.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}