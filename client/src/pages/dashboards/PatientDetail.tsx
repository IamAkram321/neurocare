import { useRoute } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MOCK_PATIENTS } from "@/lib/mockData";
import { VitalsCard } from "@/components/dashboard/VitalsCard";
import { ECGChart } from "@/components/dashboard/ECGChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, FileText, Share2, Download, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PatientDetail() {
  const [match,params] = useRoute("/dashboard/patient/:id");
  const { user } = useAuth();
  
  if (!match) return <div>Patient not found</div>;
  
  const patient = MOCK_PATIENTS.find(p => p.id === params.id);
  
  if (!patient) return <div>Patient not found</div>;

  return (
    <DashboardLayout>
       <div className="space-y-6">
         {/* Breadcrumb / Back */}
         <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="pl-0"><ArrowLeft className="mr-1 h-4 w-4"/> Back to Dashboard</Button>
            </Link>
            <span>/</span>
            <span className="font-medium text-foreground">Patient {patient.id}</span>
         </div>

         {/* Patient Header */}
         <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
           <div>
             <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
             <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
               <span>ID: <span className="font-mono text-foreground">{patient.id}</span></span>
               <span>Age: <span className="text-foreground">{patient.age}</span></span>
               <span>Gender: <span className="text-foreground">{patient.gender}</span></span>
               <span>Ward: <span className="text-foreground">{patient.wardId}</span> - Bed {patient.bedNumber}</span>
             </div>
           </div>
           
           <div className="flex space-x-2">
             <Button variant="outline"><Share2 className="mr-2 h-4 w-4"/> Share Data</Button>
             <Button variant="default"><Download className="mr-2 h-4 w-4"/> Export Report</Button>
           </div>
         </div>

         {/* Alert Banner if Critical */}
         {patient.status === "critical" && (
           <div className="rounded-lg border-l-4 border-l-destructive bg-destructive/10 p-4 text-destructive-foreground">
             <div className="flex items-center">
               <AlertTriangle className="h-5 w-5 mr-3 text-destructive" />
               <p className="font-bold text-destructive">CRITICAL STATUS ALERT</p>
             </div>
             <p className="mt-1 ml-8 text-sm text-destructive/80">
               Patient is exhibiting signs of tachycardia and low oxygen saturation. Immediate intervention required.
             </p>
           </div>
         )}

         {/* Main Monitoring Grid */}
         <div className="grid gap-6 md:grid-cols-4">
            {/* Vitals Column */}
            <div className="md:col-span-1 space-y-4">
               <VitalsCard 
                 title="Heart Rate" 
                 value={patient.vitals.heartRate} 
                 unit="bpm" 
                 status={patient.vitals.heartRate > 100 ? "critical" : "normal"}
                 trend="up"
               />
               <VitalsCard 
                 title="SpO2" 
                 value={patient.vitals.spO2} 
                 unit="%" 
                 status={patient.vitals.spO2 < 90 ? "critical" : "normal"}
                 trend="down"
               />
               <VitalsCard 
                 title="Blood Pressure" 
                 value={patient.vitals.bloodPressure} 
                 unit="mmHg" 
                 status="warning"
                 trend="stable"
               />
               <VitalsCard 
                 title="Resp Rate" 
                 value={patient.vitals.respiratoryRate} 
                 unit="/min" 
                 status="normal"
                 trend="stable"
               />
               <VitalsCard 
                 title="Temperature" 
                 value={patient.vitals.temperature} 
                 unit="°C" 
                 status={patient.vitals.temperature > 38 ? "warning" : "normal"}
                 trend="up"
               />
            </div>

            {/* Charts Column */}
            <div className="md:col-span-3 space-y-6">
               <Card className="col-span-3">
                 <CardHeader>
                   <CardTitle>Real-Time ECG Monitoring</CardTitle>
                   <CardDescription>Live telemetry feed from bedside monitor</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <ECGChart patientId={patient.id} height={200} />
                 </CardContent>
               </Card>

               <Tabs defaultValue="history">
                 <TabsList>
                   <TabsTrigger value="history">Vitals History</TabsTrigger>
                   <TabsTrigger value="medications">Medications</TabsTrigger>
                   <TabsTrigger value="notes">Doctor Notes</TabsTrigger>
                 </TabsList>
                 <TabsContent value="history" className="space-y-4">
                    <Card>
                      <CardHeader>
                         <CardTitle>24-Hour Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded border border-dashed text-muted-foreground">
                           Historical Chart Placeholder (Requires chart.js historical data setup)
                        </div>
                      </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="medications">
                    <Card>
                      <CardHeader><CardTitle>Active Prescriptions</CardTitle></CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex justify-between items-center p-2 rounded bg-muted/30">
                            <div>
                               <p className="font-medium">Epinephrine</p>
                               <p className="text-xs text-muted-foreground">1mg IV push every 3-5 min</p>
                            </div>
                            <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Active</span>
                          </li>
                          <li className="flex justify-between items-center p-2 rounded bg-muted/30">
                            <div>
                               <p className="font-medium">Amiodarone</p>
                               <p className="text-xs text-muted-foreground">300mg IV Bolus</p>
                            </div>
                             <span className="text-xs font-mono bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">Completed</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                 </TabsContent>
                 <TabsContent value="notes">
                   <Card>
                      <CardHeader>
                         <CardTitle>Clinical Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                           <div className="flex gap-4">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-xs">JS</span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Dr. James Smith <span className="text-muted-foreground font-normal ml-2">2 hours ago</span></p>
                                <p className="text-sm text-muted-foreground">Patient showing signs of improvement after initial intervention. Monitor BP closely for next 4 hours.</p>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="font-bold text-xs">RN</span>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Nurse Sarah <span className="text-muted-foreground font-normal ml-2">30 mins ago</span></p>
                                <p className="text-sm text-muted-foreground">Administered scheduled fluids. Patient resting comfortably.</p>
                              </div>
                           </div>
                        </div>
                      </CardContent>
                   </Card>
                 </TabsContent>
               </Tabs>
            </div>
         </div>
       </div>
    </DashboardLayout>
  );
}
